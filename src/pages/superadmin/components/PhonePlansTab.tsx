import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiPhoneCall,
  FiStar,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  fetchPhonePlans,
  createPhonePlan,
  updatePhonePlan,
  deletePhonePlan,
  IPhonePlan,
} from "../../../services/phonePlan";
import { addToast } from "@heroui/react";
import { WorkspaceLoader } from "../../../components/common/LoadingState";

interface PhonePlansTabProps {
  isLight: boolean;
}

interface FormErrors {
  name?: string;
  price?: string;
  description?: string;
  callMinutes?: string;
  textSegments?: string;
  overageRate?: string;
}

const sanitizeNumberDot = (val: string): string => {
  let clean = val.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = parts[0] + "." + parts.slice(1).join("");
  }
  return clean;
};

const PhonePlansTab: React.FC<PhonePlansTabProps> = ({ isLight }) => {
  const [plans, setPlans] = useState<IPhonePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<IPhonePlan | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [description, setDescription] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [callMinutesInput, setCallMinutesInput] = useState("");
  const [textSegmentsInput, setTextSegmentsInput] = useState("");
  const [overageRateInput, setOverageRateInput] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const clearFieldError = (field: keyof FormErrors) => {
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchPhonePlans();
      setPlans(data);
    } catch (err: any) {
      console.error("Error loading phone plans:", err);
      addToast({
        title: "Error",
        description: "Failed to load phone service plans",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setName("");
    setPriceInput("");
    setDescription("");
    setIsPopular(false);
    setCallMinutesInput("");
    setTextSegmentsInput("");
    setOverageRateInput("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: IPhonePlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPriceInput(String(plan.price));
    setDescription(plan.description || "");
    setIsPopular(plan.isPopular || false);
    setCallMinutesInput(String(plan.callMinutes ?? 1000));
    setTextSegmentsInput(String(plan.textSegments ?? 2500));
    setOverageRateInput(String(plan.overageRate ?? plan.overageCallRate ?? plan.overageTextRate ?? 0.02));
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = "Plan name is required";
    } else if (name.trim().length > 50) {
      errors.name = "Plan name cannot exceed 50 characters";
    }

    if (!priceInput.trim()) {
      errors.price = "Monthly price is required";
    } else if (isNaN(Number(priceInput)) || Number(priceInput) < 0) {
      errors.price = "Price must be a valid non-negative number";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }

    if (!callMinutesInput.trim()) {
      errors.callMinutes = "Call minutes is required";
    } else if (isNaN(Number(callMinutesInput)) || Number(callMinutesInput) < 0) {
      errors.callMinutes = "Call minutes must be a valid number";
    }

    if (!textSegmentsInput.trim()) {
      errors.textSegments = "Text segments is required";
    } else if (isNaN(Number(textSegmentsInput)) || Number(textSegmentsInput) < 0) {
      errors.textSegments = "Text segments must be a valid number";
    }

    if (!overageRateInput.trim()) {
      errors.overageRate = "Overage charge is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast({
        title: "Validation Error",
        description: "Please fix the errors highlighted below",
        color: "warning",
      });
      return;
    }

    setFormErrors({});
    setSaving(true);
    try {
      const overageVal = overageRateInput.trim();
      const numVal = isNaN(Number(overageVal)) ? 0.02 : Number(overageVal);
      const payload = {
        name: name.trim(),
        price: Number(priceInput),
        description: description.trim(),
        isPopular,
        callMinutes: Number(callMinutesInput) || 0,
        textSegments: Number(textSegmentsInput) || 0,
        overageRate: overageVal,
        overageCallRate: numVal,
        overageTextRate: numVal,
      };

      if (editingPlan) {
        await updatePhonePlan(editingPlan._id, payload);
        addToast({
          title: "Plan Updated",
          description: `${name} plan updated successfully`,
          color: "success",
        });
      } else {
        await createPhonePlan(payload);
        addToast({
          title: "Plan Created",
          description: `${name} plan created successfully`,
          color: "success",
        });
      }

      setIsModalOpen(false);
      await loadPlans();
    } catch (err: any) {
      console.error("Failed to save phone plan:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save phone plan",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalTarget) return;
    setDeleting(true);
    try {
      await deletePhonePlan(deleteModalTarget.id);
      addToast({
        title: "Plan Deleted",
        description: `${deleteModalTarget.name} phone plan deleted successfully`,
        color: "success",
      });
      setDeleteModalTarget(null);
      await loadPlans();
    } catch (err: any) {
      console.error("Failed to delete phone plan:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete phone plan",
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FiPhoneCall className="text-sky-500" />
            <span>Phone Service Plans</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your monthly telecom pricing tiers, included minutes/SMS, overage rates, and features stored dynamically in the database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <FiPlus className="text-sm" />
          <span>Add Phone Plan</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <WorkspaceLoader message="LOADING..." minHeight="min-h-[350px]" />
      ) : plans.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${isLight ? "bg-white border-slate-200" : "bg-[#111A2E] border-[#1E2B45]"
            }`}
        >
          <FiPhoneCall className="mx-auto text-4xl text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Phone Plans Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Click "Add Phone Plan" to create your first telecom plan.</p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Create Plan
          </button>
        </div>
      ) : (
        /* Plans Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 ${plan.isPopular
                ? isLight
                  ? "bg-white border-sky-400 shadow-xl shadow-sky-500/10 ring-2 ring-sky-400"
                  : "bg-[#111A2E] border-sky-500 shadow-xl shadow-sky-500/20 ring-2 ring-sky-500"
                : isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  : "bg-[#111A2E] border-[#1E2B45] hover:border-slate-700"
                }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <FiStar className="text-xs fill-current" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                {/* Plan Title & Price */}
                <div className="flex items-start justify-between gap-2 pt-1 mb-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                      {plan.description || "Custom telecom plan"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">/mo</span>
                  </div>
                </div>

                {/* What's Included Box */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2 my-4 ${isLight ? "bg-sky-50/50 border-sky-100" : "bg-[#0B101D] border-[#1E2B45]"
                    }`}
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    What's Included
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="text-sky-500 shrink-0" />
                    <span>{plan.callMinutes?.toLocaleString()} outbound call minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="text-sky-500 shrink-0" />
                    <span>{plan.textSegments?.toLocaleString()} text segments</span>
                  </div>
                </div>

                {/* Overage Rates Box */}
                <div
                  className={`p-3.5 rounded-xl border space-y-1 mb-4 ${isLight ? "bg-amber-50/40 border-amber-200/60" : "bg-[#0B101D] border-[#1E2B45]"
                    }`}
                >
                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Overage Charge
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                    <span className="font-black text-slate-900 dark:text-white">
                      {typeof plan.overageRate === "number"
                        ? `$${plan.overageRate} / extra min or SMS`
                        : plan.overageRate || (plan.overageCallRate ? `$${plan.overageCallRate} / extra min or SMS` : "$0.02 / extra min or SMS")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(plan)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiEdit2 className="text-xs" />
                  <span>Edit Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteModalTarget({ id: plan._id, name: plan.name })}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 transition-all max-h-[90vh] overflow-y-auto ${isLight ? "bg-white text-slate-900" : "bg-[#111A2E] text-white border border-[#1E2B45]"
              }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <FiPhoneCall className="text-sky-500" />
                <span>{editingPlan ? `Edit ${editingPlan.name} Plan` : "Add New Phone Plan"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Plan Name *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">{name.length}/50</span>
                  </div>
                  <input
                    type="text"
                    maxLength={50}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) clearFieldError("name");
                    }}
                    placeholder="e.g. Starter, Growth, Scale"
                    className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.name
                      ? "border-red-500 bg-red-50/10 focus:border-red-500"
                      : isLight
                        ? "bg-white border-slate-300 focus:border-sky-500"
                        : "bg-[#0B101D] border-[#1E2B45] focus:border-sky-500 text-white"
                      }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Price ($) *
                  </label>
                  <input
                    type="text"
                    value={priceInput}
                    onChange={(e) => {
                      const val = sanitizeNumberDot(e.target.value);
                      setPriceInput(val);
                      if (formErrors.price) clearFieldError("price");
                    }}
                    placeholder="e.g. 50 or 49.99"
                    className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.price
                      ? "border-red-500 bg-red-50/10 focus:border-red-500"
                      : isLight
                        ? "bg-white border-slate-300 focus:border-sky-500"
                        : "bg-[#0B101D] border-[#1E2B45] focus:border-sky-500 text-white"
                      }`}
                  />
                  {formErrors.price && (
                    <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Description / Subtitle *
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{description.length}/200</span>
                </div>
                <input
                  type="text"
                  maxLength={200}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) clearFieldError("description");
                  }}
                  placeholder="e.g. Best for solo or low-volume practices"
                  className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.description
                    ? "border-red-500 bg-red-50/10 focus:border-red-500"
                    : isLight
                      ? "bg-white border-slate-300 focus:border-sky-500"
                      : "bg-[#0B101D] border-[#1E2B45] focus:border-sky-500 text-white"
                    }`}
                />
                {formErrors.description && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                  <FiStar className="text-amber-500" />
                  <span>Mark as "MOST POPULAR"</span>
                </label>
              </div>

              {/* Volumes Section */}
              <div className="p-3.5 rounded-xl border space-y-3 bg-slate-50/50 dark:bg-[#0B101D] dark:border-[#1E2B45]">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Included Allowances
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Call Minutes *
                    </label>
                    <input
                      type="text"
                      value={callMinutesInput}
                      onChange={(e) => {
                        const val = sanitizeNumberDot(e.target.value);
                        setCallMinutesInput(val);
                        if (formErrors.callMinutes) clearFieldError("callMinutes");
                      }}
                      placeholder="1000"
                      className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.callMinutes
                        ? "border-red-500 bg-red-50/10 focus:border-red-500"
                        : isLight
                          ? "bg-white border-slate-300"
                          : "bg-[#111A2E] border-[#1E2B45] text-white"
                        }`}
                    />
                    {formErrors.callMinutes && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.callMinutes}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Text Segments *
                    </label>
                    <input
                      type="text"
                      value={textSegmentsInput}
                      onChange={(e) => {
                        const val = sanitizeNumberDot(e.target.value);
                        setTextSegmentsInput(val);
                        if (formErrors.textSegments) clearFieldError("textSegments");
                      }}
                      placeholder="2500"
                      className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.textSegments
                        ? "border-red-500 bg-red-50/10 focus:border-red-500"
                        : isLight
                          ? "bg-white border-slate-300"
                          : "bg-[#111A2E] border-[#1E2B45] text-white"
                        }`}
                    />
                    {formErrors.textSegments && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.textSegments}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Overage Charge Section */}
              <div className="p-3.5 rounded-xl border space-y-2 bg-amber-50/30 dark:bg-[#0B101D] dark:border-[#1E2B45]">
                <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Overage Charge *
                </label>
                <input
                  type="text"
                  value={overageRateInput}
                  onChange={(e) => {
                    setOverageRateInput(e.target.value);
                    if (formErrors.overageRate) clearFieldError("overageRate");
                  }}
                  placeholder="e.g. 0.02 or $0.02 / extra min or SMS"
                  className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none transition-all ${formErrors.overageRate
                    ? "border-red-500 bg-red-50/10 focus:border-red-500"
                    : isLight
                      ? "bg-white border-slate-300"
                      : "bg-[#111A2E] border-[#1E2B45] text-white"
                    }`}
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Enter rate amount or text description (numbers & text both allowed).
                </p>
                {formErrors.overageRate && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1">{formErrors.overageRate}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 transition-all ${isLight ? "bg-white text-slate-900" : "bg-[#111A2E] text-white border border-[#1E2B45]"
              }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="text-xl" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Phone Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">"{deleteModalTarget.name}"</span>? This will permanently remove this telecom plan from the database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModalTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? "Deleting..." : "Delete Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhonePlansTab;
