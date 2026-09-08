import React, { useState, useEffect, useMemo } from "react";
import {
  FiShield,
  FiLock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiLayers,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
} from "react-icons/fi";
import { addToast } from "@heroui/react";
import {
  IRole,
  IPermission,
  CreateRolePayload,
  fetchRolesList,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissionsList,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../../services/rolesAndPermissions";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import CustomSelect from "./CustomSelect";
import { RoleModal } from "./rolesAndPermissions/RoleModal";
import { PermissionModal } from "./rolesAndPermissions/PermissionModal";
import { ManagePermissionsModal } from "./rolesAndPermissions/ManagePermissionsModal";
import { DeleteConfirmModal } from "./rolesAndPermissions/DeleteConfirmModal";

interface RolesAndPermissionsTabProps {
  isLight: boolean;
}

const RolesAndPermissionsTab: React.FC<RolesAndPermissionsTabProps> = ({ isLight }) => {
  const [activeSubTab, setActiveSubTab] = useState<"roles" | "permissions">("roles");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionStatusFilter, setPermissionStatusFilter] = useState("All");

  // Expandable Role Rows for viewing all assigned permissions inline
  const [expandedRoleIds, setExpandedRoleIds] = useState<string[]>([]);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [managingRole, setManagingRole] = useState<IRole | null>(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<IPermission | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "role" | "permission";
    id: string;
    name: string;
  } | null>(null);

  // Load Initial Data from Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        fetchRolesList(),
        fetchPermissionsList(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err: any) {
      console.error("Error loading roles and permissions:", err);
      addToast({
        title: "Error",
        description: "Failed to load roles and permissions data",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Handlers: Role Modal ---
  const handleOpenAddRole = () => {
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (item: IRole) => {
    setEditingRole(item);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (payload: CreateRolePayload) => {
    setSaving(true);
    try {
      if (editingRole) {
        await updateRole(editingRole._id, payload);
        addToast({
          title: "Role Updated",
          description: `Role '${payload.title}' details updated successfully`,
          color: "success",
        });
        setIsRoleModalOpen(false);
        loadData();
      } else {
        const created = await createRole(payload);
        addToast({
          title: "Role Created",
          description: `Role '${payload.title}' created. You can now configure its permissions.`,
          color: "success",
        });
        setIsRoleModalOpen(false);
        await loadData();
        if (created) {
          handleOpenManagePermissions(created);
        }
      }
    } catch (err: any) {
      console.error("Failed to save role:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save role";
      addToast({
        title: "Error",
        description: msg,
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers: Manage Permissions Modal ---
  const handleOpenManagePermissions = (roleItem: IRole) => {
    setManagingRole(roleItem);
    setIsPermissionsModalOpen(true);
  };

  const handleSaveRolePermissions = async (roleId: string, permissionIds: string[]) => {
    setSaving(true);
    try {
      await updateRole(roleId, {
        permissions: permissionIds,
      });

      addToast({
        title: "Permissions Saved",
        description: `Successfully updated ${permissionIds.length} permissions for '${
          managingRole?.title || managingRole?.role
        }'`,
        color: "success",
      });

      setIsPermissionsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error("Failed to save permissions for role:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to save permissions for role";
      addToast({
        title: "Error",
        description: msg,
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleRowExpansion = (roleId: string) => {
    setExpandedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  // --- Handlers: Permission CRUD Modal ---
  const handleOpenAddPermission = () => {
    setEditingPermission(null);
    setIsPermissionModalOpen(true);
  };

  const handleOpenEditPermission = (item: IPermission) => {
    setEditingPermission(item);
    setIsPermissionModalOpen(true);
  };

  const handleTogglePermissionStatus = async (item: IPermission) => {
    const newStatus: "active" | "inactive" =
      item.status === "active" ? "inactive" : "active";
    setPermissions((prev) =>
      prev.map((p) => (p._id === item._id ? { ...p, status: newStatus } : p))
    );
    try {
      await updatePermission(item._id, { status: newStatus });
      addToast({
        title: "Status Updated",
        description: `Permission '${item.title}' is now ${newStatus}`,
        color: "success",
      });
    } catch (err: any) {
      console.error("Failed to update permission status:", err);
      setPermissions((prev) =>
        prev.map((p) => (p._id === item._id ? { ...p, status: item.status } : p))
      );
      addToast({
        title: "Error",
        description: "Failed to update permission status",
        color: "danger",
      });
    }
  };

  const handleSavePermission = async (payload: {
    title: string;
    description: string;
    status: "active" | "inactive";
  }) => {
    setSaving(true);
    try {
      if (editingPermission) {
        await updatePermission(editingPermission._id, payload);
        addToast({
          title: "Permission Updated",
          description: `Permission '${payload.title}' updated successfully`,
          color: "success",
        });
      } else {
        await createPermission(payload);
        addToast({
          title: "Permission Created",
          description: `Permission '${payload.title}' created successfully`,
          color: "success",
        });
      }
      setIsPermissionModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error("Failed to save permission:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to save permission";
      addToast({
        title: "Error",
        description: msg,
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers: Delete Target ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "role") {
        await deleteRole(deleteTarget.id);
        addToast({
          title: "Role Deleted",
          description: `Role '${deleteTarget.name}' deleted successfully`,
          color: "success",
        });
      } else {
        await deletePermission(deleteTarget.id);
        addToast({
          title: "Permission Deleted",
          description: `Permission '${deleteTarget.name}' deleted successfully`,
          color: "success",
        });
      }
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete item",
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered lists
  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.role && r.role.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  const filteredPermissions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return permissions.filter((p) => {
      const matchesSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesStatus =
        permissionStatusFilter === "All" || !permissionStatusFilter
          ? true
          : (p.status || "active").toLowerCase() ===
            permissionStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [permissions, searchQuery, permissionStatusFilter]);

  const stats = useMemo(() => {
    const totalRoles = roles.length;
    const totalPermissions = permissions.length;
    const activePermissions = permissions.filter((p) => p.status === "active").length;
    const avgPermsPerRole =
      totalRoles > 0
        ? Math.round(
            roles.reduce(
              (acc, r) =>
                acc + (r.permissions ? r.permissions.filter(Boolean).length : 0),
              0
            ) / totalRoles
          )
        : 0;
    return { totalRoles, totalPermissions, activePermissions, avgPermsPerRole };
  }, [roles, permissions]);

  if (loading) {
    return (
      <WorkspaceLoader
        message="LOADING ROLES & PERMISSIONS..."
        minHeight="min-h-[400px]"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1
            className={`text-2xl font-black tracking-tight flex items-center gap-2.5 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            <FiShield className="text-[#20a9f8]" />
            <span>Roles & Permissions</span>
          </h1>
          <p
            className={`text-xs mt-1 font-medium ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Configure system roles, prefill permissions, and edit access matrices via dedicated modals.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {activeSubTab === "roles" ? (
            <button
              type="button"
              onClick={handleOpenAddRole}
              className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FiPlus className="text-base" />
              <span>Add Role</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddPermission}
              className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FiPlus className="text-base" />
              <span>Add Permission</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveSubTab("roles")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#20a9f8]/50 ${
            activeSubTab === "roles"
              ? "ring-2 ring-[#20a9f8]/40 border-[#20a9f8]"
              : ""
          } ${
            isLight
              ? "bg-white border-slate-200/90 shadow-sm"
              : "bg-[#0F172A] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Roles
            </p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-[#20a9f8] flex items-center justify-center text-base">
              <FiUsers />
            </div>
          </div>
          <h3
            className={`text-2xl font-black mt-2 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {stats.totalRoles}
          </h3>
        </div>

        <div
          onClick={() => setActiveSubTab("permissions")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/50 ${
            activeSubTab === "permissions"
              ? "ring-2 ring-emerald-500/40 border-emerald-500"
              : ""
          } ${
            isLight
              ? "bg-white border-slate-200/90 shadow-sm"
              : "bg-[#0F172A] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Active Permissions
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-base">
              <FiCheckCircle />
            </div>
          </div>
          <h3
            className={`text-2xl font-black mt-2 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {stats.activePermissions}
          </h3>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200/90 shadow-sm"
              : "bg-[#0F172A] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Total Modules
            </p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-400 flex items-center justify-center text-base">
              <FiLayers />
            </div>
          </div>
          <h3
            className={`text-2xl font-black mt-2 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {stats.totalPermissions}
          </h3>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200/90 shadow-sm"
              : "bg-[#0F172A] border-[#1E2B45]"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Avg Perms / Role
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center text-base">
              <FiLock />
            </div>
          </div>
          <h3
            className={`text-2xl font-black mt-2 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {stats.avgPermsPerRole}
          </h3>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab("roles");
            setSearchQuery("");
          }}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeSubTab === "roles"
              ? "border-[#20a9f8] text-[#20a9f8]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiUsers />
          <span>System Roles ({roles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab("permissions");
            setSearchQuery("");
          }}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeSubTab === "permissions"
              ? "border-[#20a9f8] text-[#20a9f8]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiLock />
          <span>Permission Modules ({permissions.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl border ${
          isLight
            ? "bg-white border-slate-200/90 shadow-sm"
            : "bg-[#0F172A]/60 border-[#1E2B45]"
        }`}
      >
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-3 text-sm text-slate-400" />
          <input
            type="text"
            placeholder={
              activeSubTab === "roles"
                ? "Search role title, identifier key, or description..."
                : "Search permission module or description..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm rounded-lg pl-10 pr-9 py-2 focus:outline-none transition-colors ${
              isLight
                ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 hover:border-[#20a9f8] focus:border-[#20a9f8] focus:bg-white"
                : "bg-[#111A2E] border border-[#1E2B45] text-slate-200 placeholder-slate-500 hover:border-[#20a9f8] focus:border-[#20a9f8]"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <FiX className="text-base" />
            </button>
          )}
        </div>

        {activeSubTab === "permissions" && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <CustomSelect
              value={permissionStatusFilter}
              options={["All", "Active", "Inactive"]}
              onChange={setPermissionStatusFilter}
              isLight={isLight}
              className="w-full sm:w-44"
            />
          </div>
        )}
      </div>

      {/* SUB-TAB 1: ROLES TABLE WITH MANAGE PERMISSIONS BUTTONS */}
      {activeSubTab === "roles" && (
        <>
          {filteredRoles.length === 0 ? (
            <div
              className={`py-16 text-center border-2 border-dashed rounded-3xl space-y-4 ${
                isLight ? "bg-white border-slate-200" : "bg-[#0F172A] border-slate-800"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center justify-center mx-auto text-2xl">
                <FiUsers />
              </div>
              <div>
                <h3
                  className={`text-lg font-bold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  No Roles Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                  {searchQuery
                    ? "No roles match your search keyword. Try adjusting search criteria."
                    : "There are currently no roles created. Click below to add your first role."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddRole}
                className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <FiPlus className="text-base" />
                <span>Create First Role</span>
              </button>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr
                      className={`text-[11px] font-bold uppercase tracking-wider border-b ${
                        isLight
                          ? "bg-slate-50 text-slate-500 border-slate-200"
                          : "bg-[#111A2E] text-slate-400 border-[#1E293B]"
                      }`}
                    >
                      <th className="py-3.5 px-4 sm:px-6 w-[25%]">Role Name</th>
                      <th className="py-3.5 px-4 w-[16%]">Identifier Key</th>
                      <th className="py-3.5 px-4 w-[20%]">Description</th>
                      <th className="py-3.5 px-4 w-[25%]">Assigned Permissions</th>
                      <th className="py-3.5 px-4 sm:px-6 w-[14%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y text-xs ${
                      isLight
                        ? "divide-slate-200/80 text-slate-700"
                        : "divide-[#1E293B] text-slate-300"
                    }`}
                  >
                    {filteredRoles.map((roleItem) => {
                      const rolePermissions = (roleItem.permissions || []).filter(Boolean);
                      const permCount = rolePermissions.length;
                      const isExpanded = expandedRoleIds.includes(roleItem._id);

                      // Extract permission names
                      const permNames: string[] = rolePermissions.map((p: any) => {
                        if (typeof p === "string") {
                          const found = permissions.find((perm) => perm._id === p);
                          return found ? found.title : p;
                        }
                        const idStr = p._id || String(p);
                        const found = permissions.find((perm) => perm._id === idStr);
                        return found ? found.title : p.title || idStr;
                      });

                      return (
                        <React.Fragment key={roleItem._id}>
                          <tr
                            className={`transition-colors ${
                              isLight ? "hover:bg-slate-50/70" : "hover:bg-[#111A2E]/60"
                            } ${
                              isExpanded
                                ? isLight
                                  ? "bg-sky-50/30"
                                  : "bg-[#152238]/40"
                                : ""
                            }`}
                          >
                            {/* Role Name */}
                            <td className="py-4 px-4 sm:px-6 font-bold w-[25%]">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#20a9f8] flex items-center justify-center shrink-0 text-sm font-black shadow-xs">
                                  <FiShield />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`font-black text-sm block truncate ${
                                      isLight ? "text-slate-900" : "text-white"
                                    }`}
                                  >
                                    {roleItem.title || roleItem.role}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Identifier Key */}
                            <td className="py-4 px-4 w-[16%]">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg border font-mono font-bold text-xs bg-slate-500/10 border-slate-500/20 text-[#20a9f8]">
                                {roleItem.role}
                              </span>
                            </td>

                            {/* Description */}
                            <td className="py-4 px-4 w-[20%]">
                              {roleItem.description ? (
                                <p
                                  className={`text-xs line-clamp-1 ${
                                    isLight ? "text-slate-600" : "text-slate-400"
                                  }`}
                                  title={roleItem.description}
                                >
                                  {roleItem.description}
                                </p>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">
                                  No description
                                </span>
                              )}
                            </td>

                            {/* Permissions Badges + Manage Permissions Modal Button */}
                            <td className="py-4 px-4 w-[25%]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenManagePermissions(roleItem)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                                    permCount > 0
                                      ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
                                      : "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                                  }`}
                                  title="Open dedicated modal to edit permissions"
                                >
                                  <FiLock className="text-xs shrink-0" />
                                  <span>{permCount} Permissions</span>
                                  <FiSliders className="text-xs ml-0.5 opacity-70" />
                                </button>

                                {permCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleRowExpansion(roleItem._id)}
                                    className={`p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer`}
                                    title={isExpanded ? "Collapse preview" : "Expand preview"}
                                  >
                                    {isExpanded ? (
                                      <FiChevronUp className="text-sm" />
                                    ) : (
                                      <FiChevronDown className="text-sm" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 sm:px-6 w-[14%] text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenManagePermissions(roleItem)}
                                  className="p-2 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer"
                                  title="Manage / Edit Permissions (Dedicated Modal)"
                                >
                                  <FiLock className="text-sm" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRole(roleItem)}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    isLight
                                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                      : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
                                  }`}
                                  title="Edit Role Details (Title, Key, Description)"
                                >
                                  <FiEdit2 className="text-sm" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: "role",
                                      id: roleItem._id,
                                      name: roleItem.title || roleItem.role,
                                    })
                                  }
                                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Delete Role"
                                >
                                  <FiTrash2 className="text-sm" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Inline Preview */}
                          {isExpanded && (
                            <tr className={isLight ? "bg-slate-50/80" : "bg-[#0c1424]"}>
                              <td
                                colSpan={5}
                                className="py-3 px-6 sm:px-8 border-b border-slate-200/60 dark:border-slate-800"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                      Active Permissions ({permCount}):
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenManagePermissions(roleItem)}
                                      className="text-xs font-bold text-[#20a9f8] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <FiSliders className="text-xs" />
                                      <span>Edit Permissions in Modal</span>
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {permNames.map((pName, idx) => (
                                      <span
                                        key={idx}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                          isLight
                                            ? "bg-white border border-slate-200 text-slate-800 shadow-2xs"
                                            : "bg-[#111A2E] border border-[#1E2B45] text-slate-200"
                                        }`}
                                      >
                                        <FiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                                        <span>{pName}</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 2: PERMISSIONS TABLE */}
      {activeSubTab === "permissions" && (
        <>
          {filteredPermissions.length === 0 ? (
            <div
              className={`py-16 text-center border-2 border-dashed rounded-3xl space-y-4 ${
                isLight ? "bg-white border-slate-200" : "bg-[#0F172A] border-slate-800"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-400 flex items-center justify-center mx-auto text-2xl">
                <FiLock />
              </div>
              <div>
                <h3
                  className={`text-lg font-bold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  No Permissions Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                  {searchQuery || permissionStatusFilter !== "All"
                    ? "No permissions match your filter criteria. Try resetting search."
                    : "No system permissions found. Click below to create one."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddPermission}
                className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <FiPlus className="text-base" />
                <span>Create First Permission</span>
              </button>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr
                      className={`text-[11px] font-bold uppercase tracking-wider border-b ${
                        isLight
                          ? "bg-slate-50 text-slate-500 border-slate-200"
                          : "bg-[#111A2E] text-slate-400 border-[#1E293B]"
                      }`}
                    >
                      <th className="py-3.5 px-4 sm:px-6 w-[35%]">Permission Module</th>
                      <th className="py-3.5 px-4 w-[35%]">Description</th>
                      <th className="py-3.5 px-4 w-[15%]">Status</th>
                      <th className="py-3.5 px-4 sm:px-6 w-[15%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y text-xs ${
                      isLight
                        ? "divide-slate-200/80 text-slate-700"
                        : "divide-[#1E293B] text-slate-300"
                    }`}
                  >
                    {filteredPermissions.map((perm) => {
                      const isInactive = perm.status === "inactive";
                      return (
                        <tr
                          key={perm._id}
                          className={`transition-colors ${
                            isInactive ? "opacity-60" : ""
                          } ${
                            isLight ? "hover:bg-slate-50/70" : "hover:bg-[#111A2E]/60"
                          }`}
                        >
                          {/* Permission Title with Toggle Switch */}
                          <td className="py-4 px-4 sm:px-6 font-bold w-[35%]">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleTogglePermissionStatus(perm)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                                  !isInactive
                                    ? "bg-emerald-500"
                                    : isLight
                                    ? "bg-slate-300"
                                    : "bg-slate-700"
                                }`}
                                title={
                                  !isInactive
                                    ? "Click to deactivate"
                                    : "Click to activate"
                                }
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                                    !isInactive ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isInactive
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    : "bg-purple-50 dark:bg-purple-950/60 text-purple-400"
                                }`}
                              >
                                <FiLock className="text-xs" />
                              </div>
                              <span
                                className={`font-black truncate ${
                                  isInactive
                                    ? "line-through text-slate-400 dark:text-slate-500"
                                    : isLight
                                    ? "text-slate-900"
                                    : "text-white"
                                }`}
                              >
                                {perm.title}
                              </span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-4 px-4 w-[35%]">
                            {perm.description ? (
                              <p
                                className={`text-xs line-clamp-1 ${
                                  isInactive
                                    ? "text-slate-400 dark:text-slate-600 line-through"
                                    : isLight
                                    ? "text-slate-600"
                                    : "text-slate-400"
                                }`}
                                title={perm.description}
                              >
                                {perm.description}
                              </p>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">
                                No description
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 w-[15%]">
                            <span
                              className={`inline-flex items-center justify-center gap-1.5 w-[76px] py-1 rounded-full text-[11px] font-bold tracking-wide ${
                                !isInactive
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  !isInactive ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                              />
                              <span>{!isInactive ? "Active" : "Inactive"}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 sm:px-6 w-[15%] text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPermission(perm)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  isLight
                                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
                                }`}
                                title="Edit Permission"
                              >
                                <FiEdit2 className="text-sm" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "permission",
                                    id: perm._id,
                                    name: perm.title,
                                  })
                                }
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                                title="Delete Permission"
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
        </>
      )}

      {/* 1. ROLE MODAL (Create/Edit Role Details) */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        editingRole={editingRole}
        isLight={isLight}
        saving={saving}
        onSave={handleSaveRole}
      />

      {/* 2. MANAGE PERMISSIONS MODAL (Assign Permissions to Role) */}
      <ManagePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        managingRole={managingRole}
        permissions={permissions}
        isLight={isLight}
        saving={saving}
        onSavePermissions={handleSaveRolePermissions}
      />

      {/* 3. PERMISSION MODAL (Create/Edit Permission Module) */}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        editingPermission={editingPermission}
        isLight={isLight}
        saving={saving}
        onSave={handleSavePermission}
      />

      {/* 4. DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        deleteTarget={deleteTarget}
        isLight={isLight}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RolesAndPermissionsTab;
