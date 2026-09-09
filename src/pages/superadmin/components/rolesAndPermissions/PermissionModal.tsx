import React, { useState, useEffect } from "react";
import { FiLock, FiX } from "react-icons/fi";
import { IPermission } from "../../../../services/rolesAndPermissions";

export interface PermissionFormErrors {
  title?: string | undefined;
}

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPermission: IPermission | null;
  isLight: boolean;
  saving: boolean;
  onSave: (payload: {
    title: string;
    description: string;
    status: "active" | "inactive";
  }) => Promise<void>;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  editingPermission,
  isLight,
  saving,
  onSave,
}) => {
  const [permissionTitle, setPermissionTitle] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [permissionStatus, setPermissionStatus] = useState<"active" | "inactive">("active");
  const [errors, setErrors] = useState<PermissionFormErrors>({});

  useEffect(() => {
    if (isOpen) {
      if (editingPermission) {
        setPermissionTitle(editingPermission.title || "");
        setPermissionDescription(editingPermission.description || "");
        setPermissionStatus(editingPermission.status || "active");
      } else {
        setPermissionTitle("");
        setPermissionDescription("");
        setPermissionStatus("active");
      }
      setErrors({});
    }
  }, [isOpen, editingPermission]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: PermissionFormErrors = {};
    const trimmedTitle = permissionTitle.trim();

    if (!trimmedTitle) {
      newErrors.title = "Permission title is required";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      title: trimmedTitle,
      description: permissionDescription.trim(),
      status: permissionStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-7 space-y-5 transition-all max-h-[90vh] overflow-y-auto ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#111A2E] border-[#1E2B45] text-white"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <FiLock className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                {editingPermission
                  ? "Edit Permission Module"
                  : "Create Permission Module"}
              </h2>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Define system capability modules for access control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? "hover:bg-slate-100 text-slate-500"
                : "hover:bg-[#1E2B45] text-slate-400"
            }`}
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Permission Title */}
          <div>
            <label
              className={`block text-xs font-bold mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Permission Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Management"
              value={permissionTitle}
              onChange={(e) => {
                setPermissionTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({
                    ...prev,
                    title: undefined,
                  }));
                }
              }}
              className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                errors.title
                  ? "border-red-500 bg-red-500/5 focus:border-red-500"
                  : isLight
                  ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-xs font-bold mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Allows viewing, editing, assigning, and exporting partner network referrals."
              value={permissionDescription}
              onChange={(e) => setPermissionDescription(e.target.value)}
              className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all resize-none ${
                isLight
                  ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
              }`}
            />
          </div>

          {/* Status Switch */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-xl border ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-[#070C18] border-[#1E2B45]"
            }`}
          >
            <div>
              <p
                className={`text-xs font-bold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Active Status
              </p>
              <p
                className={`text-[11px] ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Enable to make this permission available for role assignment
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPermissionStatus((prev) =>
                  prev === "active" ? "inactive" : "active"
                )
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                permissionStatus === "active"
                  ? "bg-emerald-500"
                  : isLight
                  ? "bg-slate-300"
                  : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                  permissionStatus === "active"
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-500/20">
            <button
              type="button"
              onClick={onClose}
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
              className="bg-[#20a9f8] hover:bg-[#1a96de] px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>
                  {editingPermission ? "Update Permission" : "Create Permission"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;
