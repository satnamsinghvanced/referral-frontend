import React, { useState, useEffect, useMemo } from "react";
import { FiShield, FiX, FiSearch, FiCheck, FiLock, FiCheckSquare, FiSquare } from "react-icons/fi";
import { IRole, IPermission, CreateRolePayload } from "../../../../services/rolesAndPermissions";

export interface RoleFormErrors {
  title?: string | undefined;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRole: IRole | null;
  permissions: IPermission[];
  isLight: boolean;
  saving: boolean;
  onSave: (payload: CreateRolePayload) => Promise<void>;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  editingRole,
  permissions,
  isLight,
  saving,
  onSave,
}) => {
  const [roleTitle, setRoleTitle] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [permSearch, setPermSearch] = useState("");
  const [errors, setErrors] = useState<RoleFormErrors>({});

  const resolvePermissionId = (p: any): string | null => {
    if (!p) return null;
    const idStr = typeof p === "string" ? p.trim() : (p._id || p.id || "").toString().trim();
    const titleStr =
      typeof p === "object" && p.title
        ? p.title.trim()
        : typeof p === "string"
        ? p.trim()
        : "";

    const byId = permissions.find(
      (perm) =>
        perm._id === idStr ||
        (perm as any).id === idStr ||
        String(perm._id) === String(idStr)
    );
    if (byId) return byId._id;

    if (titleStr) {
      const lower = titleStr.toLowerCase();
      const byTitle = permissions.find(
        (perm) =>
          perm.title.toLowerCase().trim() === lower ||
          perm._id.toLowerCase() === lower
      );
      if (byTitle) return byTitle._id;
    }

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetNorm = normalize(titleStr || idStr);
    if (targetNorm) {
      const bySlug = permissions.find((perm) => {
        const norm = normalize(perm.title);
        return norm === targetNorm || norm.includes(targetNorm) || targetNorm.includes(norm);
      });
      if (bySlug) return bySlug._id;
    }

    return null;
  };

  useEffect(() => {
    if (isOpen) {
      setPermSearch("");
      if (editingRole) {
        setRoleTitle(editingRole.title || editingRole.role || "");
        setRoleDescription(editingRole.description || "");

        const rawList = (editingRole.permissions || []).filter(Boolean);
        const resolvedIds = new Set<string>();
        rawList.forEach((p: any) => {
          const resolvedId = resolvePermissionId(p);
          if (resolvedId) resolvedIds.add(resolvedId);
        });
        setSelectedPermissionIds(Array.from(resolvedIds));
      } else {
        setRoleTitle("");
        setRoleDescription("");
        setSelectedPermissionIds([]);
      }
      setErrors({});
    }
  }, [isOpen, editingRole, permissions]);

  const filteredPermissions = useMemo(() => {
    const q = permSearch.toLowerCase().trim();
    if (!q) return permissions;
    return permissions.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [permissions, permSearch]);

  if (!isOpen) return null;

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissionIds.length === permissions.length) {
      setSelectedPermissionIds([]);
    } else {
      setSelectedPermissionIds(permissions.map((p) => p._id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RoleFormErrors = {};
    const trimmedTitle = roleTitle.trim();

    if (!trimmedTitle) {
      newErrors.title = "Role title is required";
    } else if (trimmedTitle.length < 2) {
      newErrors.title = "Role title must be at least 2 characters";
    }

    const trimmedKey = (editingRole?.role || trimmedTitle)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "");

    if (!trimmedKey) {
      newErrors.title = "Please provide a valid role title";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const validPermissionIds = Array.from(
      new Set(
        selectedPermissionIds.filter((id) =>
          permissions.some((p) => p._id === id || String(p._id) === String(id))
        )
      )
    );

    const payload: CreateRolePayload = {
      title: trimmedTitle,
      role: trimmedKey,
      description: roleDescription.trim(),
      permissions: validPermissionIds,
    };

    await onSave(payload);
  };

  const allSelected = permissions.length > 0 && selectedPermissionIds.length === permissions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-5 sm:p-6 space-y-4 transition-all max-h-[90vh] flex flex-col ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#111A2E] border-[#1E2B45] text-white"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3.5 border-slate-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#20a9f8]/10 text-[#20a9f8]">
              <FiShield className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                {editingRole ? "Edit System Role" : "Create New System Role"}
              </h2>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Define role details and assign module permissions
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
          <div className="space-y-3 shrink-0">
            <div>
              <label
                className={`block text-xs font-bold mb-1 ${
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
                  setRoleTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                className={`w-full text-sm rounded-xl px-3.5 py-2 focus:outline-none transition-all ${
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

            <div>
              <label
                className={`block text-xs font-bold mb-1 ${
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
                className={`w-full text-sm rounded-xl px-3.5 py-2 focus:outline-none transition-all resize-none ${
                  isLight
                    ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#20a9f8]"
                    : "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:border-[#20a9f8]"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden pt-2 border-t border-slate-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Assign Permissions
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#20a9f8]/10 text-[#20a9f8] border border-[#20a9f8]/20">
                  {selectedPermissionIds.length} of {permissions.length} Selected
                </span>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-bold text-[#20a9f8] hover:underline cursor-pointer flex items-center gap-1"
              >
                {allSelected ? <FiSquare className="text-xs" /> : <FiCheckSquare className="text-xs" />}
                <span>{allSelected ? "Deselect All" : "Select All"}</span>
              </button>
            </div>

            <div className="relative mb-2 shrink-0">
              <FiSearch className="absolute left-3 top-2.5 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Filter permissions..."
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                className={`w-full text-xs rounded-lg pl-8 pr-8 py-1.5 focus:outline-none transition-colors ${
                  isLight
                    ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#20a9f8]"
                    : "bg-[#070C18] border border-[#1E2B45] text-slate-200 placeholder-slate-500 focus:border-[#20a9f8]"
                }`}
              />
              {permSearch && (
                <button
                  type="button"
                  onClick={() => setPermSearch("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-56">
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  No permissions found matching "{permSearch}"
                </div>
              ) : (
                filteredPermissions.map((perm) => {
                  const isSelected = selectedPermissionIds.includes(perm._id);
                  return (
                    <div
                      key={perm._id}
                      onClick={() => handleTogglePermission(perm._id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isSelected
                          ? isLight
                            ? "bg-[#20a9f8]/10 border-[#20a9f8]/60 shadow-xs ring-1 ring-[#20a9f8]/30"
                            : "bg-[#20a9f8]/15 border-[#20a9f8] shadow-sm"
                          : isLight
                          ? "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                          : "bg-[#070C18] border-[#1E2B45] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#20a9f8] text-white"
                              : isLight
                              ? "bg-slate-200 text-slate-500"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <FiLock className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${
                              isSelected
                                ? isLight
                                  ? "text-slate-900"
                                  : "text-white"
                                : isLight
                                ? "text-slate-700"
                                : "text-slate-300"
                            }`}
                          >
                            {perm.title}
                          </p>
                          {perm.description && (
                            <p
                              className={`text-[11px] truncate ${
                                isLight ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#20a9f8] border-[#20a9f8] text-white"
                            : isLight
                            ? "border-slate-300 bg-white"
                            : "border-slate-600 bg-[#0F172A]"
                        }`}
                      >
                        {isSelected && <FiCheck className="text-xs stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-500/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className="bg-[#20a9f8] hover:bg-[#1a96de] px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingRole ? "Update Role" : "Create Role"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
