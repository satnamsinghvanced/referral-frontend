import React, { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiPercent,
  FiDollarSign,
  FiX,
  FiAlertTriangle,
  FiSearch,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiTag,
  FiFileText,
} from "react-icons/fi";
import {
  fetchDiscountCoupons,
  createDiscountCoupon,
  updateDiscountCoupon,
  toggleDiscountCoupon,
  deleteDiscountCoupon,
  IDiscountCoupon,
} from "../../../services/discountCoupon";
import { addToast, DatePicker } from "@heroui/react";
import { parseDate, today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import CustomSelect from "./CustomSelect";

interface DiscountCouponsTabProps {
  isLight: boolean;
}

interface FormErrors {
  title?: string;
  code?: string;
  value?: string;
  description?: string;
}

const sanitizeNumberDot = (val: string): string => {
  let clean = val.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = parts[0] + "." + parts.slice(1).join("");
  }
  return clean;
};

const DiscountCouponsTab: React.FC<DiscountCouponsTabProps> = ({ isLight }) => {
  const [coupons, setCoupons] = useState<IDiscountCoupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "percent" | "fixed">("all");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<IDiscountCoupon | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<{ id: string; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [expiryDateInput, setExpiryDateInput] = useState("");
  const [maxRedemptionsInput, setMaxRedemptionsInput] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const clearFieldError = (field: keyof FormErrors) => {
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await fetchDiscountCoupons();
      setCoupons(data);
    } catch (err: any) {
      console.error("Error loading discount coupons:", err);
      addToast({
        title: "Error",
        description: "Failed to load discount coupons",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    addToast({
      title: "Copied!",
      description: `Coupon code '${couponCode}' copied to clipboard`,
      color: "success",
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setTitle("");
    setDescription("");
    setCode("");
    setValueInput("");
    setType("percent");
    setIsActive(true);
    setExpiryDateInput("");
    setMaxRedemptionsInput("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: IDiscountCoupon) => {
    setEditingCoupon(coupon);
    setTitle(coupon.title || "");
    setDescription(coupon.description || "");
    setCode(coupon.code || "");
    setValueInput(String(coupon.value ?? ""));
    setType(coupon.type || "percent");
    setIsActive(coupon.isActive ?? true);
    setExpiryDateInput(
      coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : ""
    );
    setMaxRedemptionsInput(coupon.maxRedemptions ? String(coupon.maxRedemptions) : "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!title.trim()) {
      errors.title = "Coupon title is required";
    }

    if (!code.trim()) {
      errors.code = "Coupon code is required";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(code.trim())) {
      errors.code = "Code can only contain letters, numbers, hyphens (-), and underscores (_)";
    }

    const numVal = parseFloat(valueInput);
    if (!valueInput || isNaN(numVal) || numVal <= 0) {
      errors.value = "Enter a valid positive discount amount";
    } else if (type === "percent" && numVal > 100) {
      errors.value = "Percentage discount cannot exceed 100%";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        code: code.trim().toUpperCase(),
        value: numVal,
        type,
        isActive,
        expiryDate: expiryDateInput ? new Date(expiryDateInput).toISOString() : null,
        maxRedemptions: maxRedemptionsInput ? parseInt(maxRedemptionsInput, 10) : null,
      };

      if (editingCoupon) {
        await updateDiscountCoupon(editingCoupon._id, payload);
        addToast({
          title: "Success",
          description: `Discount coupon '${payload.code}' updated successfully`,
          color: "success",
        });
      } else {
        await createDiscountCoupon(payload);
        addToast({
          title: "Success",
          description: `Discount coupon '${payload.code}' created successfully`,
          color: "success",
        });
      }

      setIsModalOpen(false);
      loadCoupons();
    } catch (err: any) {
      console.error("Error saving discount coupon:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save discount coupon";
      addToast({
        title: "Error",
        description: msg,
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon: IDiscountCoupon) => {
    try {
      // Optimistic update
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
      );
      await toggleDiscountCoupon(coupon._id);
      addToast({
        title: "Status Updated",
        description: `Coupon '${coupon.code}' is now ${!coupon.isActive ? "Active" : "Inactive"}`,
        color: "success",
      });
    } catch (err: any) {
      console.error("Error toggling coupon status:", err);
      // Revert on error
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, isActive: coupon.isActive } : c))
      );
      addToast({
        title: "Error",
        description: "Failed to update coupon status",
        color: "danger",
      });
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteModalTarget) return;
    setDeleting(true);
    try {
      await deleteDiscountCoupon(deleteModalTarget.id);
      addToast({
        title: "Deleted",
        description: `Discount coupon '${deleteModalTarget.code}' has been deleted`,
        color: "success",
      });
      setDeleteModalTarget(null);
      loadCoupons();
    } catch (err: any) {
      console.error("Error deleting discount coupon:", err);
      addToast({
        title: "Error",
        description: "Failed to delete discount coupon",
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.isActive) ||
        (statusFilter === "inactive" && !c.isActive);

      const matchesType = typeFilter === "all" || c.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const percentCount = coupons.filter((c) => c.type === "percent").length;
    const fixedCount = coupons.filter((c) => c.type === "fixed").length;
    return { total, active, percentCount, fixedCount };
  }, [coupons]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            <FiTag className="text-[#20a9f8]" />
            Discount Coupons
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Create and manage promotional discount codes with custom titles, descriptions, and rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          style={{ backgroundColor: "#20a9f8" }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-base" />
          <span>Create Discount Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setStatusFilter("all");
            setTypeFilter("all");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#20a9f8]/50 ${
            statusFilter === "all" && typeFilter === "all" ? "ring-2 ring-[#20a9f8]/40 border-[#20a9f8]" : ""
          } ${
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Total Coupons
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#20a9f8]">
              <FiTag className="text-sm" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            {stats.total}
          </p>
        </div>

        <div
          onClick={() => {
            setStatusFilter("active");
            setTypeFilter("all");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/50 ${
            statusFilter === "active" ? "ring-2 ring-emerald-500/40 border-emerald-500" : ""
          } ${
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Active Coupons
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <FiCheckCircle className="text-sm" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            {stats.active}
          </p>
        </div>

        <div
          onClick={() => {
            setTypeFilter("percent");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-purple-500/50 ${
            typeFilter === "percent" ? "ring-2 ring-purple-500/40 border-purple-500" : ""
          } ${
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Percentage (%)
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FiPercent className="text-sm" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            {stats.percentCount}
          </p>
        </div>

        <div
          onClick={() => {
            setTypeFilter("fixed");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-amber-500/50 ${
            typeFilter === "fixed" ? "ring-2 ring-amber-500/40 border-amber-500" : ""
          } ${
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Fixed Amount ($)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FiDollarSign className="text-sm" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            {stats.fixedCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl border ${
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
        }`}
      >
        <div className="relative flex-1 w-full">
          <FiSearch
            className={`absolute left-3.5 top-3 text-sm ${isLight ? "text-slate-400" : "text-slate-400"}`}
          />
          <input
            type="text"
            placeholder="Search by title, description, or coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none transition-all ${
              isLight
                ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8] focus:bg-white"
                : "bg-[#070C18] border border-[#1E2B45] text-slate-200 placeholder-slate-500 focus:border-[#20a9f8]"
            }`}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <CustomSelect
            value={
              statusFilter === "all"
                ? "All Statuses"
                : statusFilter === "active"
                ? "Active Only"
                : "Inactive Only"
            }
            options={["All Statuses", "Active Only", "Inactive Only"]}
            onChange={(val) => {
              if (val.includes("Active")) setStatusFilter("active");
              else if (val.includes("Inactive")) setStatusFilter("inactive");
              else setStatusFilter("all");
            }}
            isLight={isLight}
            className="w-full sm:w-44"
          />

          {/* Type Filter */}
          <CustomSelect
            value={
              typeFilter === "all"
                ? "All Types"
                : typeFilter === "percent"
                ? "Percentage (%)"
                : "Fixed Amount ($)"
            }
            options={["All Types", "Percentage (%)", "Fixed Amount ($)"]}
            onChange={(val) => {
              if (val.includes("Percent")) setTypeFilter("percent");
              else if (val.includes("Fixed")) setTypeFilter("fixed");
              else setTypeFilter("all");
            }}
            isLight={isLight}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Coupons Table / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <WorkspaceLoader message="Loading discount coupons..." />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div
          className={`py-16 px-4 text-center rounded-2xl border ${
            isLight
              ? "bg-white border-slate-200 text-slate-600"
              : "bg-[#111A2E] border-[#1E2B45] text-slate-400"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-[#20a9f8]/10 text-[#20a9f8] flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiTag />
          </div>
          <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-900" : "text-white"}`}>
            No Discount Coupons Found
          </h3>
          <p className="text-xs max-w-sm mx-auto mb-6">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all"
              ? "No discount coupons match your active filters. Try adjusting search criteria."
              : "You haven't created any promotional discount coupons yet. Click below to add one."}
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{ backgroundColor: "#20a9f8" }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Create First Coupon</span>
          </button>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-sm ${
            isLight ? "bg-white border-slate-200/90" : "bg-[#111A2E] border-[#1E2B45]"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`text-[11px] uppercase tracking-wider font-extrabold border-b ${
                    isLight
                      ? "bg-slate-50 border-slate-200/80 text-slate-500"
                      : "bg-[#0B132B] border-[#1E2B45] text-slate-400"
                  }`}
                >
                  <th className="py-3.5 px-4 sm:px-6">Title & Description</th>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isLight ? "divide-slate-200/60" : "divide-[#1E2B45]/60"
                }`}
              >
                {filteredCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expiryDate && new Date(coupon.expiryDate) < new Date();

                  return (
                    <tr
                      key={coupon._id}
                      className={`transition-colors ${
                        isLight ? "hover:bg-slate-50/70" : "hover:bg-[#162238]"
                      }`}
                    >
                      {/* Title & Description */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-0.5">
                          <p
                            className={`font-bold text-sm ${
                              isLight ? "text-slate-900" : "text-white"
                            }`}
                          >
                            {coupon.title || `${coupon.code} Discount`}
                          </p>
                          {coupon.description ? (
                            <p
                              className={`text-xs line-clamp-1 max-w-xs ${
                                isLight ? "text-slate-500" : "text-slate-400"
                              }`}
                              title={coupon.description}
                            >
                              {coupon.description}
                            </p>
                          ) : (
                            <p
                              className={`text-[11px] ${
                                isLight ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {coupon.type === "percent" ? `${coupon.value}%` : `$${coupon.value}`} off on checkout
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs bg-slate-500/10 border-slate-500/20 text-[#20a9f8]">
                          <span>{coupon.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code"
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedCode === coupon.code ? (
                              <FiCheck className="text-emerald-500 text-xs" />
                            ) : (
                              <FiCopy className="text-xs" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            coupon.type === "percent"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {coupon.type === "percent"
                            ? `${coupon.value}% OFF`
                            : `$${Number(coupon.value).toFixed(2)} OFF`}
                        </span>
                      </td>

                      {/* Validity / Expiry */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          {coupon.expiryDate ? (
                            <div className="flex items-center gap-1.5">
                              <FiCalendar
                                className={`text-xs ${
                                  isExpired ? "text-red-400" : "text-slate-400"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  isExpired
                                    ? "text-red-400 font-semibold"
                                    : isLight
                                    ? "text-slate-700"
                                    : "text-slate-300"
                                }`}
                              >
                                {new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              {isExpired && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                  Expired
                                </span>
                              )}
                            </div>
                          ) : (
                            <span
                              className={`text-[11px] font-medium ${
                                isLight ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              Never Expires
                            </span>
                          )}

                          {coupon.maxRedemptions && (
                            <p
                              className={`text-[11px] ${
                                isLight ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              Limit: {coupon.maxRedemptions} redemptions
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Active Status Switch */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(coupon)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            coupon.isActive ? "bg-[#20a9f8]" : isLight ? "bg-slate-300" : "bg-slate-700"
                          }`}
                          title={`Click to ${coupon.isActive ? "deactivate" : "activate"}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              coupon.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(coupon)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isLight
                                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
                            }`}
                            title="Edit Coupon"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalTarget({ id: coupon._id, code: coupon.code })
                            }
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-7 space-y-5 transition-all max-h-[90vh] overflow-y-auto ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#111A2E] border-[#1E2B45] text-white"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#20a9f8]/10 text-[#20a9f8]">
                  <FiTag className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-black">
                    {editingCoupon ? "Edit Discount Coupon" : "Create Discount Coupon"}
                  </h2>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Configure discount code rules and settings
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[#1E2B45] text-slate-400"
                }`}
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCoupon} className="space-y-4">
              {/* Title Field */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Coupon Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Summer Clinic Launch 20% Off"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearFieldError("title");
                    }}
                    className={`w-full text-sm rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none transition-all ${
                      formErrors.title
                        ? "border-red-500 bg-red-500/5 focus:border-red-500"
                        : isLight
                        ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                        : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                    }`}
                  />
                  <FiTag className={`absolute right-3.5 top-3.5 text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                </div>
                {formErrors.title && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Description
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="e.g. Special promotional discount for dental clinics subscribing in Q3."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full text-sm rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none transition-all resize-none ${
                      isLight
                        ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                        : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                    }`}
                  />
                  <FiFileText className={`absolute right-3.5 top-3.5 text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                </div>
              </div>

              {/* Coupon Code Field */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase().replace(/\s+/g, ""));
                    clearFieldError("code");
                  }}
                  className={`w-full text-sm font-mono font-bold uppercase rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                    formErrors.code
                      ? "border-red-500 bg-red-500/5 focus:border-red-500"
                      : isLight
                      ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                      : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                  }`}
                />
                {formErrors.code && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.code}</p>
                )}
              </div>

              {/* Discount Type & Value in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type Selection */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType("percent")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        type === "percent"
                          ? "bg-[#20a9f8] text-white border-[#20a9f8] shadow-sm"
                          : isLight
                          ? "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "bg-[#070C18] border-[#1E2B45] text-slate-400 hover:text-white"
                      }`}
                    >
                      <FiPercent />
                      <span>Percent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("fixed")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        type === "fixed"
                          ? "bg-[#20a9f8] text-white border-[#20a9f8] shadow-sm"
                          : isLight
                          ? "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "bg-[#070C18] border-[#1E2B45] text-slate-400 hover:text-white"
                      }`}
                    >
                      <FiDollarSign />
                      <span>Fixed ($)</span>
                    </button>
                  </div>
                </div>

                {/* Value Input */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Discount Amount ({type === "percent" ? "%" : "$"}) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={type === "percent" ? "e.g. 20" : "e.g. 50.00"}
                      value={valueInput}
                      onChange={(e) => {
                        setValueInput(sanitizeNumberDot(e.target.value));
                        clearFieldError("value");
                      }}
                      className={`w-full text-sm rounded-xl pl-8 pr-3.5 py-2.5 focus:outline-none transition-all ${
                        formErrors.value
                          ? "border-red-500 bg-red-500/5 focus:border-red-500"
                          : isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                          : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                      }`}
                    />
                    <span
                      className={`absolute left-3 top-3 text-xs font-bold ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {type === "percent" ? "%" : "$"}
                    </span>
                  </div>
                  {formErrors.value && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.value}</p>
                  )}
                </div>
              </div>

              {/* Expiry Date & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Expiration Date (Optional)
                  </label>
                  <DatePicker
                    aria-label="Expiration Date"
                    minValue={today(getLocalTimeZone())}
                    value={
                      expiryDateInput
                        ? (() => {
                            try {
                              return parseDate(expiryDateInput);
                            } catch {
                              return null;
                            }
                          })()
                        : null
                    }
                    onChange={(date: CalendarDate | null) => {
                      if (date) {
                        setExpiryDateInput(date.toString());
                      } else {
                        setExpiryDateInput("");
                      }
                    }}
                    showMonthAndYearPickers
                    variant="bordered"
                    radius="lg"
                    className="w-full"
                    classNames={{
                      inputWrapper: isLight
                        ? "bg-slate-50 border border-slate-300 text-slate-900 hover:border-[#20a9f8] data-[focus=true]:border-[#20a9f8] data-[hover=true]:border-[#20a9f8]"
                        : "bg-[#070C18] border border-[#1E2B45] text-white hover:border-[#20a9f8] data-[focus=true]:border-[#20a9f8] data-[hover=true]:border-[#20a9f8]",
                      popoverContent: isLight
                        ? "bg-white text-slate-900 border border-slate-200 shadow-xl"
                        : "bg-[#0F172A] text-white border border-[#1E2B45] shadow-2xl",
                      calendar: isLight ? "bg-white text-slate-900" : "bg-[#0F172A] text-white",
                      calendarContent: isLight ? "bg-white text-slate-900" : "bg-[#0F172A] text-white",
                    }}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Max Redemptions (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={maxRedemptionsInput}
                    onChange={(e) => setMaxRedemptionsInput(e.target.value.replace(/[^0-9]/g, ""))}
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                      isLight
                        ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                        : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                    }`}
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div
                className={`flex items-center justify-between p-3.5 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[#070C18] border-[#1E2B45]"
                }`}
              >
                <div>
                  <p className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                    Active Status
                  </p>
                  <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Enable to allow this coupon to be used during checkout
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-[#20a9f8]" : isLight ? "bg-slate-300" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isLight
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: "#20a9f8" }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCoupon ? "Update Coupon" : "Create Coupon"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#111A2E] border-[#1E2B45] text-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <FiAlertTriangle className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">Delete Discount Coupon</h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Are you sure you want to delete coupon{" "}
                  <strong className="text-red-400 font-mono">'{deleteModalTarget.code}'</strong>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalTarget(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isLight
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteCoupon}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Coupon</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCouponsTab;
