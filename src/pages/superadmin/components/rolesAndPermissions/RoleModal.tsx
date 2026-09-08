import React, { useState, useEffect } from "react";
import { FiShield, FiX } from "react-icons/fi";
import { IRole, CreateRolePayload } from "../../../../services/rolesAndPermissions";

export interface RoleFormErrors {
  title?: string | undefined;
  role?: string | undefined;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRole: IRole | null;
  isLight: boolean;
  saving: boolean;
  onSave: (payload: CreateRolePayload) => Promise<void>;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  editingRole,
  isLight,
  saving,
  onSave,
}) => {
  const [roleTitle, setRoleTitle] = useState("");
  const [roleKey, setRoleKey] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [errors, setErrors] = useState<RoleFormErrors>({});

  useEffect(() => {
    if (isOpen) {
      if (editingRole) {
        setRoleTitle(editingRole.title || editingRole.role || "");
        setRoleKey(editingRole.role || "");
        setRoleDescription(editingRole.description || "");
      } else {
        setRoleTitle("");
        setRoleKey("");
        setRoleDescription("");
      }
      setErrors({});
    }
  }, [isOpen, editingRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RoleFormErrors = {};
    const trimmedTitle = roleTitle.trim();
    const trimmedKey = (roleKey || roleTitle).trim().toLowerCase().replace(/\s+/g, "_");

    if (!trimmedKey) {
      newErrors.role = "Role key/identifier is required";
    } else if (trimmedKey.length < 2) {
      newErrors.role = "Role key must be at least 2 characters";
    } else if (!/^[a-zA-Z0-9-_ ]+$/.test(trimmedKey)) {
      newErrors.role = "Role key can only contain letters, numbers, hyphens, and underscores";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreateRolePayload = {
      title: trimmedTitle || trimmedKey,
      role: trimmedKey,
      description: roleDescription.trim(),
    };

    await onSave(payload);
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
            <div className="p-2.5 rounded-xl bg-[#20a9f8]/10 text-[#20a9f8]">
              <FiShield className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                {editingRole ? "Edit Role Details" : "Create New System Role"}
              </h2>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Define role display name, identifier key, and description
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
          {/* Role Title */}
          <div>
            <label
              className={`block text-xs font-bold mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Role Title (Display Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Office Manager"
              value={roleTitle}
              onChange={(e) => {
                const val = e.target.value;
                setRoleTitle(val);
                if (!editingRole) {
                  setRoleKey(
                    val
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")
                  );
                }
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
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

          {/* Role Identifier Key */}
          <div>
            <label
              className={`block text-xs font-bold mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Role Identifier Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. office_manager"
              value={roleKey}
              onChange={(e) => {
                setRoleKey(e.target.value.toLowerCase().replace(/\s+/g, "_"));
                if (errors.role) {
                  setErrors((prev) => ({ ...prev, role: undefined }));
                }
              }}
              className={`w-full text-sm font-mono font-bold rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                errors.role
                  ? "border-red-500 bg-red-500/5 focus:border-red-500"
                  : isLight
                  ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
              }`}
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.role}
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
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Full administrative control for front-office clinical operations and appointments."
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all resize-none ${
                isLight
                  ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
              }`}
            />
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
                <span>{editingRole ? "Update Details" : "Create & Next"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
