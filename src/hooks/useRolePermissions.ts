import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useFetchUser } from "./settings/useUser";
import { usePermissions, useRoles } from "./useCommon";
import { useMemo } from "react";
import { Permission } from "../types/common";

export const PERMISSIONS = {
  MANAGE_REFERRALS: "Manage Referrals",
  VIEW_ANALYTICS: "View Analytics",
  MANAGE_TEAM: "Manage Team",
  MANAGE_BILLING: "Manage Billing",
  MANAGE_SETTINGS: "Manage Settings",
  MANAGE_REVIEWS: "Manage Reviews",
};

export const useRolePermissions = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const { data: userData, isLoading: isUserLoading } = useFetchUser(
    user?.role === "SuperAdmin" ? "" : user?.userId || "",
  );
  const { data: allPermissions, isLoading: isPermissionsLoading } =
    usePermissions();
  const { data: allRoles, isLoading: isRolesLoading } = useRoles();

  const isTeamMember = useMemo(() => {
    if (!userData) return !!user?.createdBy;
    const typedUser = userData as any;
    return !!typedUser.createdBy || !!user?.createdBy;
  }, [userData, user]);

  const isMainOwnerOrSuperAdmin = useMemo(() => {
    if (user?.role === "SuperAdmin") return true;
    if (!isTeamMember && (user?.role === "admin" || user?.role === "Admin")) {
      return true;
    }
    return false;
  }, [user, isTeamMember]);

  const userPermissions = useMemo(() => {
    if (!userData) return [];
    const typedUser = userData as any;

    if (isMainOwnerOrSuperAdmin) {
      return allPermissions?.map((p) => p.title) || Object.values(PERMISSIONS);
    }

    const permissions: string[] = [];
    if (typedUser.permissions) {
      typedUser.permissions.forEach((p: any) => {
        if (typeof p === "string") {
          const found = allPermissions?.find((ap) => ap._id === p);
          if (found) {
            permissions.push(found.title);
          } else {
            permissions.push(p);
          }
        } else if (p && p.title) {
          permissions.push(p.title);
        }
      });
    }

    if (permissions.length === 0) {
      const roleId =
        typeof typedUser.role === "string" ? typedUser.role : typedUser.role?._id;
      if (roleId && allRoles) {
        const userRole = allRoles.find((r) => r._id === roleId);
        if (userRole && userRole.permissions) {
          userRole.permissions.forEach((p: Permission) => {
            const pTitle = typeof p === "string" ? p : p.title;
            if (pTitle && !permissions.includes(pTitle)) {
              permissions.push(pTitle);
            }
          });
        }
      }
    }
    return permissions;
  }, [userData, allPermissions, allRoles, isMainOwnerOrSuperAdmin]);

  const hasPermission = (permissionTitle: string) => {
    if (isMainOwnerOrSuperAdmin) return true;
    const target = permissionTitle.toLowerCase().trim();
    return userPermissions.some((p) => p.toLowerCase().trim() === target);
  };

  const hasAnyPermission = (permissionTitles: string[]) => {
    if (isMainOwnerOrSuperAdmin) return true;
    return permissionTitles.some((title) => hasPermission(title));
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    isLoading: isUserLoading || isPermissionsLoading || isRolesLoading,
    isAdmin: isMainOwnerOrSuperAdmin,
  };
};
