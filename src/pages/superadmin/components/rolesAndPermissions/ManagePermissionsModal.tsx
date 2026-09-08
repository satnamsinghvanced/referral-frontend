import React, { useState, useEffect, useMemo } from "react";
import {
  FiLock,
  FiX,
  FiZap,
  FiSearch,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import { addToast } from "@heroui/react";
import { IRole, IPermission } from "../../../../services/rolesAndPermissions";
import { ROLE_PRESETS, RolePreset } from "./presets";

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  managingRole: IRole | null;
  permissions: IPermission[];
  isLight: boolean;
  saving: boolean;
  onSavePermissions: (roleId: string, permissionIds: string[]) => Promise<void>;
}

export const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({
  isOpen,
  onClose,
  managingRole,
  permissions,
  isLight,
  saving,
  onSavePermissions,
}) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [modalPermSearch, setModalPermSearch] = useState("");

  const resolvePermissionId = (p: any): string | null => {
    if (!p) return null;
    const idStr = typeof p === "string" ? p.trim() : (p._id || p.id || "").toString().trim();
    const titleStr =
      typeof p === "object" && p.title
        ? p.title.trim()
        : typeof p === "string"
        ? p.trim()
        : "";

    // 1. Direct _id match against loaded permissions
    const byId = permissions.find(
      (perm) =>
        perm._id === idStr ||
        (perm as any).id === idStr ||
        String(perm._id) === String(idStr)
    );
    if (byId) return byId._id;

    // 2. Case-insensitive Title match
    if (titleStr) {
      const lower = titleStr.toLowerCase();
      const byTitle = permissions.find(
        (perm) =>
          perm.title.toLowerCase().trim() === lower ||
          perm._id.toLowerCase() === lower
      );
      if (byTitle) return byTitle._id;
    }

    // 3. Slug / normalized string match
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
    if (isOpen && managingRole) {
      setModalPermSearch("");
      const rawList = (managingRole.permissions || []).filter(Boolean);
      const resolvedIds = new Set<string>();

      rawList.forEach((p: any) => {
        const resolvedId = resolvePermissionId(p);
        if (resolvedId) {
          resolvedIds.add(resolvedId);
        }
      });

      setSelectedPermissionIds(Array.from(resolvedIds));
    }
  }, [isOpen, managingRole, permissions]);

  const modalFilteredPermissions = useMemo(() => {
    const q = modalPermSearch.toLowerCase().trim();
    if (!q) return permissions;
    return permissions.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [permissions, modalPermSearch]);

  if (!isOpen || !managingRole) return null;

  const handleApplyPreset = (preset: RolePreset) => {
    const matchingPermIds = permissions
      .filter((p) => preset.filterMatch(p.title))
      .map((p) => p._id);

    const targetIds =
      matchingPermIds.length > 0 ? matchingPermIds : permissions.map((p) => p._id);
    setSelectedPermissionIds(targetIds);

    addToast({
      title: "Preset Selected",
      description: `Prefilled ${targetIds.length} permissions for ${preset.title}`,
      color: "success",
    });
  };

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

  const handleSave = async () => {
    // Filter strictly to valid permission IDs that exist in the database
    const validPermissionIds = Array.from(
      new Set(
        selectedPermissionIds.filter((id) =>
          permissions.some((p) => p._id === id || String(p._id) === String(id))
        )
      )
    );

    await onSavePermissions(managingRole._id, validPermissionIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl p-6 sm:p-7 space-y-5 transition-all max-h-[92vh] flex flex-col ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#111A2E] border-[#1E2B45] text-white"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <FiLock className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>Manage Permissions:</span>
                <span className="text-[#20a9f8]">
                  {managingRole.title || managingRole.role}
                </span>
              </h2>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Role Key:{" "}
                <span className="font-mono font-bold text-slate-300">
                  {managingRole.role}
                </span>{" "}
                • Configure module access
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

        {/* Quick Presets Bar */}
        <div
          className={`p-3.5 rounded-xl border shrink-0 ${
            isLight
              ? "bg-sky-50/50 border-sky-100"
              : "bg-[#09101F] border-[#1A2642]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20a9f8] flex items-center gap-1.5">
              <FiZap className="text-xs" />
              <span>Quick Prefill Presets</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Click to prefill template permissions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isLight
                    ? "bg-white hover:bg-sky-100 border-slate-200 text-slate-800 shadow-2xs hover:border-sky-300"
                    : "bg-[#111A2E] hover:bg-[#1E2B45] border-[#1E293B] text-slate-200 hover:text-white"
                }`}
              >
                <FiCheckCircle className="text-xs text-[#20a9f8]" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Modules ({selectedPermissionIds.length} of {permissions.length} active):
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-2.5 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={modalPermSearch}
                onChange={(e) => setModalPermSearch(e.target.value)}
                className={`text-xs rounded-lg pl-7 pr-6 py-1.5 focus:outline-none border ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    : "bg-[#070C18] border-[#1E2B45] text-slate-200 placeholder-slate-500"
                }`}
              />
              {modalPermSearch && (
                <button
                  type="button"
                  onClick={() => setModalPermSearch("")}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-bold text-[#20a9f8] hover:underline cursor-pointer shrink-0"
            >
              {selectedPermissionIds.length === permissions.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        </div>

        {/* Permission Checkbox Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto p-3.5 rounded-2xl border flex-1 min-h-[220px] ${
            isLight
              ? "bg-slate-50 border-slate-200"
              : "bg-[#070C18] border-[#1E2B45]"
          }`}
        >
          {modalFilteredPermissions.map((perm) => {
            const isChecked = selectedPermissionIds.includes(perm._id);
            return (
              <div
                key={perm._id}
                onClick={() => handleTogglePermission(perm._id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-[#20a9f8]/10 border-[#20a9f8]/60 shadow-xs ring-1 ring-[#20a9f8]/30"
                    : isLight
                    ? "bg-white border-slate-200 hover:border-slate-300"
                    : "bg-[#0F172A] border-[#1E293B] hover:border-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                    isChecked
                      ? "bg-[#20a9f8] text-white"
                      : isLight
                      ? "border border-slate-300 bg-white"
                      : "border border-slate-600 bg-slate-800"
                  }`}
                >
                  {isChecked && <FiCheck className="text-xs stroke-[3]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-bold truncate ${
                      isChecked
                        ? "text-[#20a9f8]"
                        : isLight
                        ? "text-slate-900"
                        : "text-white"
                    }`}
                  >
                    {perm.title}
                  </p>
                  {perm.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {perm.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-500/20 shrink-0">
          <div className="text-xs font-bold text-slate-400">
            {selectedPermissionIds.length} permissions configured
          </div>

          <div className="flex items-center gap-3">
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
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#20a9f8] hover:bg-[#1a96de] px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Permissions...</span>
                </>
              ) : (
                <span>Save Permissions</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissionsModal;
