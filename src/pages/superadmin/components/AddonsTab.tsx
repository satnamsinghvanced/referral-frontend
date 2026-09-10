import React, { useState, useEffect } from "react";
import {
  AddonData,
  fetchAddons,
  createAddon,
  updateAddon,
  deleteAddon,
} from "../../../services/addonService";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { addToast } from "@heroui/react";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

interface AddonsTabProps {
  isLight: boolean;
}

const AddonsTab: React.FC<AddonsTabProps> = ({ isLight }) => {
  const [addons, setAddons] = useState<AddonData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonData | null>(null);
  const [addonForm, setAddonForm] = useState<{
    title: string;
    price: string;
    unit: string;
    description: string;
  }>({
    title: "",
    price: "",
    unit: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    loadAddons();
  }, []);

  const loadAddons = async () => {
    try {
      setLoading(true);
      const res = await fetchAddons();
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setAddons(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch add-ons:", err);
      addToast({
        title: "Error",
        description: "Failed to load optional add-ons",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (addon?: AddonData) => {
    setFormErrors({});
    if (addon) {
      setEditingAddon(addon);
      setAddonForm({
        title: addon.title,
        price: String(addon.price),
        unit: addon.unit || "",
        description: addon.description || "",
      });
    } else {
      setEditingAddon(null);
      setAddonForm({
        title: "",
        price: "",
        unit: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAddon = async () => {
    const errors: { title?: string; price?: string } = {};

    if (!addonForm.title.trim()) {
      errors.title = "Add-on title is required";
    } else if (addonForm.title.trim().length > 60) {
      errors.title = "Add-on title cannot exceed 60 characters";
    }

    if (!addonForm.price || isNaN(Number(addonForm.price)) || Number(addonForm.price) <= 0) {
      errors.price = "Valid price is required (e.g. 50)";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      setSaving(true);
      if (editingAddon && editingAddon._id) {
        await updateAddon(editingAddon._id, {
          title: addonForm.title.trim(),
          price: Number(addonForm.price),
          unit: addonForm.unit.trim(),
          description: addonForm.description.trim(),
        });
        addToast({
          title: "Add-on Saved",
          description: `Successfully updated '${addonForm.title.trim()}'`,
          color: "success",
        });
      } else {
        await createAddon({
          title: addonForm.title.trim(),
          price: Number(addonForm.price),
          unit: addonForm.unit.trim(),
          description: addonForm.description.trim(),
        });
        addToast({
          title: "Add-on Created",
          description: `Successfully created add-on '${addonForm.title.trim()}'`,
          color: "success",
        });
      }
      setIsModalOpen(false);
      loadAddons();
    } catch (err: any) {
      console.error("Failed to save add-on:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save add-on",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAddon(deleteTarget.id);
      addToast({
        title: "Add-on Deleted",
        description: `Add-on '${deleteTarget.title}' has been deleted`,
        color: "success",
      });
      setDeleteTarget(null);
      loadAddons();
    } catch (err: any) {
      console.error("Failed to delete add-on:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete add-on",
        color: "danger",
      });
    }
  };

  if (loading) {
    return <WorkspaceLoader message="LOADING ADD-ONS..." minHeight="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            <FiPackage className="text-[#20a9f8]" />
            <span>Optional Add-ons</span>
          </h1>
          <p className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Enhance your plan with additional features and capacity
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Add New Add-on</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {addons.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center justify-center mx-auto text-2xl">
            <FiPackage />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              No Add-ons Available
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              There are currently no optional add-ons in the database. Click below to create your first add-on.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <FiPlus className="text-base" />
            <span>Create Your First Add-on</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {addons.map((addon) => (
            <div
              key={addon._id || addon.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all h-full ${
                isLight
                  ? "bg-white border-slate-200/90 shadow-sm hover:shadow-md"
                  : "bg-[#0F172A] border-[#1E293B] hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                    {addon.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(addon)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-[#20a9f8] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                      title="Edit Add-on"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          id: addon._id || addon.id!,
                          title: addon.title,
                        })
                      }
                      className="p-1.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete Add-on"
                    >
                      <FiTrash2 className="text-sm text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#20a9f8]">
                    ${addon.price}
                  </span>
                </div>
                {addon.unit && (
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    {addon.unit}
                  </p>
                )}

                <p className={`text-xs mt-4 leading-relaxed font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {addon.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add-on Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 border p-6 sm:p-7 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150 ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0F172A] border-[#1E293B] text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FiPackage className="text-[#20a9f8]" />
                <span>{editingAddon ? "Edit Add-on" : "Create New Add-on"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300 text-xs">
                  Add-on Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addonForm.title}
                  onChange={(e) => {
                    setAddonForm({ ...addonForm, title: e.target.value });
                    if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g. Additional SMS Messages, Extra User Seats"
                  className={`w-full rounded-2xl px-4 py-3 border focus:outline-none font-medium text-xs transition-all ${
                    formErrors.title
                      ? "border-red-500 ring-2 ring-red-500/20 bg-red-500/5"
                      : isLight
                        ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                        : "bg-[#111A2E] border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                  }`}
                />
                {formErrors.title && (
                  <span className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <FiAlertCircle className="text-xs shrink-0" /> {formErrors.title}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300 text-xs">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={addonForm.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                        setAddonForm({ ...addonForm, price: val });
                        if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
                      }
                    }}
                    placeholder="50"
                    className={`w-full rounded-2xl px-4 py-3 border focus:outline-none font-medium text-xs transition-all ${
                      formErrors.price
                        ? "border-red-500 ring-2 ring-red-500/20 bg-red-500/5"
                        : isLight
                          ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                          : "bg-[#111A2E] border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                    }`}
                  />
                  {formErrors.price && (
                    <span className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <FiAlertCircle className="text-xs shrink-0" /> {formErrors.price}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300 text-xs">
                    Billing Details / Subtitle
                  </label>
                  <input
                    type="text"
                    value={addonForm.unit}
                    onChange={(e) => setAddonForm({ ...addonForm, unit: e.target.value })}
                    placeholder="e.g. 1,000 messages, per user/month"
                    className={`w-full rounded-2xl px-4 py-3 border focus:outline-none font-medium text-xs transition-all ${
                      isLight
                        ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                        : "bg-[#111A2E] border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300 text-xs">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={addonForm.description}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  placeholder="Describe what this add-on provides..."
                  className={`w-full rounded-2xl px-4 py-3 border focus:outline-none font-medium text-xs resize-none transition-all ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                      : "bg-[#111A2E] border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAddon}
                disabled={saving}
                className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-2.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#20a9f8]/20 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingAddon ? "Save Add-on" : "Create Add-on"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Add-on"
        description={`Are you sure you want to delete add-on '${deleteTarget?.title}' ? This action cannot be undone.`}
      />
    </div>
  );
};

export default AddonsTab;
