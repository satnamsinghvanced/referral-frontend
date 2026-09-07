import React, { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBookmark,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { addToast } from "@heroui/react";
import { SpecialtyItem, CreateSpecialtyPayload, UpdateSpecialtyPayload, SpecialtyFormErrors } from "../../../types/specialty";
import { fetchSpecialtiesList, createSpecialty, updateSpecialty, deleteSpecialty } from "../../../services/specialty";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import CustomSelect from "./CustomSelect";

interface SpecialtiesTabProps {
  isLight: boolean;
}

const TITLE_PATTERN = /^[a-zA-Z0-9\s\-_,.&()]+$/;

const SpecialtiesTab: React.FC<SpecialtiesTabProps> = ({ isLight }) => {
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyItem | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<{ id: string; title: string } | null>(null);
  const [titleInput, setTitleInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [formErrors, setFormErrors] = useState<SpecialtyFormErrors>({});

  const clearFieldError = (field: keyof SpecialtyFormErrors) => {
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSpecialtiesList();
      setSpecialties(data);
    } catch (err: any) {
      console.error("Failed to load specialties:", err);
      addToast({
        title: "Error",
        description: "Failed to fetch medical specialties",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSpecialty(null);
    setTitleInput("");
    setDescriptionInput("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: SpecialtyItem) => {
    setEditingSpecialty(item);
    setTitleInput(item.title || "");
    setDescriptionInput(item.description || "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: SpecialtyFormErrors = {};
    const trimmedTitle = titleInput.trim();
    const trimmedDesc = descriptionInput.trim();
    if (!trimmedTitle) {
      errors.title = "Specialty title is required";
    } else if (trimmedTitle.length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (trimmedTitle.length > 50) {
      errors.title = "Title cannot exceed 50 characters";
    } else if (!TITLE_PATTERN.test(trimmedTitle)) {
      errors.title =
        "Title can only contain letters, numbers, spaces, dashes, underscores, commas, periods, ampersands (&), and parentheses.";
    } else {
      const duplicate = specialties.find(
        (s) =>
          s.title.toLowerCase() === trimmedTitle.toLowerCase() &&
          (!editingSpecialty || s._id !== editingSpecialty._id)
      );
      if (duplicate) {
        errors.title = "Specialty with this title already exists";
      }
    }
    if (trimmedDesc.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast({
        title: "Validation Error",
        description: "Please fix the errors highlighted below",
        color: "warning",
      });
      return;
    }
    setSaving(true);
    try {
      const trimmedTitle = titleInput.trim();
      const trimmedDesc = descriptionInput.trim();

      if (editingSpecialty) {
        const payload: UpdateSpecialtyPayload = {
          title: trimmedTitle,
          description: trimmedDesc,
        };
        await updateSpecialty(editingSpecialty._id, payload);
        addToast({
          title: "Specialty Updated",
          description: `Successfully updated '${trimmedTitle}'`,
          color: "success",
        });
      } else {
        const payload: CreateSpecialtyPayload = {
          title: trimmedTitle,
          description: trimmedDesc,
        };
        await createSpecialty(payload);
        addToast({
          title: "Specialty Created",
          description: `Successfully created '${trimmedTitle}'`,
          color: "success",
        });
      }
      setIsModalOpen(false);
      setCurrentPage(1);
      await loadData();
    } catch (err: any) {
      console.error("Failed to save specialty:", err);
      const apiMsg =
        err.response?.data?.message || err.message || "Failed to save specialty";
      if (apiMsg.toLowerCase().includes("already exists") || err.response?.status === 409) {
        setFormErrors((prev) => ({
          ...prev,
          title: "Specialty with this title already exists",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, general: apiMsg }));
      }
      addToast({
        title: "Error",
        description: apiMsg,
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: SpecialtyItem) => {
    const newStatus: "active" | "inactive" = item.status === "inactive" ? "active" : "inactive";
    setSpecialties((prev) =>
      prev.map((s) => (s._id === item._id ? { ...s, status: newStatus } : s))
    );
    try {
      await updateSpecialty(item._id, { status: newStatus });
      addToast({
        title: newStatus === "active" ? "Specialty Activated" : "Specialty Deactivated",
        description: `'${item.title}' status changed to ${newStatus}`,
        color: newStatus === "active" ? "success" : "warning",
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);
      await loadData();
      addToast({
        title: "Error",
        description: "Failed to update specialty status",
        color: "danger",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalTarget) return;
    setDeleting(true);
    try {
      await deleteSpecialty(deleteModalTarget.id);
      addToast({
        title: "Specialty Deleted",
        description: `'${deleteModalTarget.title}' specialty deleted successfully`,
        color: "success",
      });
      setDeleteModalTarget(null);
      await loadData();
    } catch (err: any) {
      console.error("Failed to delete specialty:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete specialty",
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredSpecialties = useMemo(() => {
    const filtered = specialties.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesStatus =
        (item.status || "active").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b._id || "").localeCompare(a._id || "");
    });
  }, [specialties, searchQuery, statusFilter]);


  const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSpecialties = useMemo(() => {
    return filteredSpecialties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSpecialties, startIndex, itemsPerPage]);

  const stats = useMemo(() => {
    const total = specialties.length;
    const active = specialties.filter((s) => s.status === "active").length;
    const inactive = specialties.filter((s) => s.status === "inactive").length;
    return { total, active, inactive };
  }, [specialties]);
  if (loading) {
    return <WorkspaceLoader message="LOADING SPECIALTIES..." minHeight="min-h-[400px]" />;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1
            className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"
              }`}
          >
            <FiBookmark className="text-[#20a9f8]" />
            <span>Specialties</span>
          </h1>
          <p className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Create, view, manage, and delete practice specialties used across registration and client accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <FiPlus className="text-base" />
          <span>Add Specialty</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0F172A] border-[#1E293B]"
            }`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Specialties</p>
            <h3 className={`text-2xl font-black mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>
              {stats.total}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-[#20a9f8] flex items-center justify-center text-xl">
            <FiBookmark />
          </div>
        </div>
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0F172A] border-[#1E293B]"
            }`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Active Specialties</p>
            <h3 className={`text-2xl font-black mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>
              {stats.active}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-xl">
            <FiCheckCircle />
          </div>
        </div>
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0F172A] border-[#1E293B]"
            }`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Inactive Specialties</p>
            <h3 className={`text-2xl font-black mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>
              {stats.inactive}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center text-xl">
            <FiXCircle />
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl border ${isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0F172A]/60 border-[#1E293B]"
          }`}
      >
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-3 text-sm text-slate-400" />
          <input
            type="text"
            placeholder="Search specialty title or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none transition-colors ${isLight
              ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white"
              : "bg-[#111A2E] border border-[#1E2B45] text-slate-200 placeholder-slate-500 focus:border-blue-500"
              }`}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <CustomSelect
            value={statusFilter}
            options={["Active", "Inactive"]}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            isLight={isLight}
          />
        </div>
      </div>

      {filteredSpecialties.length === 0 ? (
        <div
          className={`py-16 text-center border-2 border-dashed rounded-3xl space-y-4 ${isLight ? "bg-white border-slate-200" : "bg-[#0F172A] border-slate-800"
            }`}
        >
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center justify-center mx-auto text-2xl">
            <FiBookmark />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              No Specialties Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              {searchQuery || statusFilter
                ? `No ${statusFilter.toLowerCase()} specialties match your search filter criteria.`
                : "There are currently no practice specialties in the database. Click below to add one."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <FiPlus className="text-base" />
            <span>Create First Specialty</span>
          </button>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs ${isLight ? "bg-white border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
            }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`text-[11px] font-bold uppercase tracking-wider border-b ${isLight
                    ? "bg-slate-50 text-slate-500 border-slate-200"
                    : "bg-[#111A2E] text-slate-400 border-[#1E293B]"
                    }`}
                >
                  <th className="py-3.5 px-4 sm:px-6">Specialty Title</th>
                  <th className="py-3.5 px-4 sm:px-6">Description</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Created Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isLight ? "divide-slate-200/80 text-slate-700" : "divide-[#1E293B] text-slate-300"
                  }`}
              >
                {paginatedSpecialties.map((item) => {
                  const isInactive = item.status === "inactive";
                  const createdDateFormatted = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "—";
                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${isInactive ? "opacity-60" : ""} ${isLight ? "hover:bg-slate-50/70" : "hover:bg-[#111A2E]/60"
                        }`}
                    >
                      <td className="py-4 px-4 sm:px-6 font-bold">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${!isInactive ? "bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-700"
                              }`}
                            title={!isInactive ? "Click to disable specialty" : "Click to enable specialty"}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${!isInactive ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                          </button>
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isInactive
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                              : "bg-sky-50 dark:bg-sky-950/60 text-[#20a9f8]"
                              }`}
                          >
                            <FiBookmark className="text-sm" />
                          </div>
                          <span
                            className={`font-extrabold ${isInactive
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : isLight
                                ? "text-slate-900"
                                : "text-white"
                              }`}
                          >
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 max-w-xs truncate">
                        {item.description ? (
                          <span className="text-slate-600 dark:text-slate-400">
                            {item.description}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No description</span>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${!isInactive
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${!isInactive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                          />
                          <span className="capitalize">{item.status || "active"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-slate-500 dark:text-slate-400">
                        {createdDateFormatted}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl text-slate-400 hover:text-[#20a9f8] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                            title="Edit Specialty"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalTarget({ id: item._id, title: item.title })
                            }
                            className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Specialty"
                          >
                            <FiTrash2 className="text-sm text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredSpecialties.length > 0 && (
            <div
              className={`flex items-center justify-between px-4 sm:px-6 py-3.5 border-t text-xs ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
                }`}
            >
              <span className="text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold">{startIndex + 1}</span> to{" "}
                <span className="font-bold">
                  {Math.min(startIndex + itemsPerPage, filteredSpecialties.length)}
                </span>{" "}
                of <span className="font-bold">{filteredSpecialties.length}</span> specialties
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronLeft className="text-base" />
                </button>
                <span className="font-bold px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 border p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150 ${isLight
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#0F172A] border-[#1E293B] text-slate-100"
              }`}
          >
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FiBookmark className="text-[#20a9f8]" />
                <span>{editingSpecialty ? "Edit Specialty" : "Add New Specialty"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            {formErrors.general && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                <FiAlertCircle className="text-base shrink-0" />
                <span>{formErrors.general}</span>
              </div>
            )}
            <form onSubmit={handleSaveSpecialty} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Specialty Title <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {titleInput.length}/50
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={titleInput}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                    if (formErrors.title) clearFieldError("title");
                  }}
                  placeholder="e.g. Orthodontics, General Dentistry"
                  className={`w-full text-xs rounded-xl p-3 border focus:outline-none transition-all ${formErrors.title
                    ? "border-red-500 bg-red-50/10 focus:border-red-500"
                    : isLight
                      ? "bg-white border-slate-300 focus:border-[#20a9f8]"
                      : "bg-[#0B101D] border-[#1E2B45] focus:border-[#20a9f8] text-white"
                    }`}
                />
                {formErrors.title && (
                  <span className="text-xs text-red-500 font-medium tracking-wide mt-1.5 block flex items-center gap-1">
                    <FiAlertCircle className="shrink-0 text-xs" />
                    <span>{formErrors.title}</span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {descriptionInput.length}/200
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={descriptionInput}
                  onChange={(e) => {
                    setDescriptionInput(e.target.value);
                    if (formErrors.description) clearFieldError("description");
                  }}
                  placeholder="Brief description of this specialty branch..."
                  className={`w-full text-xs rounded-xl p-3 border focus:outline-none transition-all resize-none ${formErrors.description
                    ? "border-red-500 bg-red-50/10 focus:border-red-500"
                    : isLight
                      ? "bg-white border-slate-300 focus:border-[#20a9f8]"
                      : "bg-[#0B101D] border-[#1E2B45] focus:border-[#20a9f8] text-white"
                    }`}
                />
                {formErrors.description && (
                  <span className="text-xs text-red-500 font-medium tracking-wide mt-1.5 block flex items-center gap-1">
                    <FiAlertCircle className="shrink-0 text-xs" />
                    <span>{formErrors.description}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#20a9f8] hover:bg-[#1a96de] text-white shadow-md shadow-[#20a9f8]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingSpecialty
                      ? "Update Specialty"
                      : "Create Specialty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteModalTarget}
        onClose={() => setDeleteModalTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Specialty"
        description={
          deleteModalTarget ? (
            <span>
              Are you sure you want to delete specialty{" "}
              <strong className="font-bold text-slate-800 dark:text-slate-200">
                "{deleteModalTarget.title}"
              </strong>
              ? This action cannot be undone.
            </span>
          ) : undefined
        }
      />
    </div>
  );
};

export default SpecialtiesTab;