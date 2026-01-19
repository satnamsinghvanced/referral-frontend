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
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: userData, isLoading: isUserLoading } = useFetchUser(
    user?.userId || "",
  );
  const { data: allPermissions, isLoading: isPermissionsLoading } =
    usePermissions();
  const { data: allRoles, isLoading: isRolesLoading } = useRoles();

  const userPermissions = useMemo(() => {
    if (!userData) return [];

    const typedUser = userData as any;

    // If user is admin, they have all permissions
    if (
      user?.role === "admin" ||
      typedUser.role === "admin" ||
      typedUser.role?.role === "admin"
    ) {
      return Object.values(PERMISSIONS);
    }

    const permissions: string[] = [];

    // 1. Get permissions from direct assignments
    if (typedUser.permissions) {
      typedUser.permissions.forEach((p: any) => {
        if (typeof p === "string") {
          const found = allPermissions?.find((ap) => ap._id === p);
          if (found) permissions.push(found.title);
        } else if (p && p.title) {
          permissions.push(p.title);
        }
      });
    }

    // 2. Get permissions from role
    const roleId =
      typeof typedUser.role === "string" ? typedUser.role : typedUser.role?._id;

    if (roleId && allRoles) {
      const userRole = allRoles.find((r) => r._id === roleId);
      if (userRole && userRole.permissions) {
        userRole.permissions.forEach((p: Permission) => {
          if (p.title && !permissions.includes(p.title)) {
            permissions.push(p.title);
          }
        });
      }
    }

    return permissions;
  }, [userData, allPermissions, allRoles, user?.role]);

  const hasPermission = (permissionTitle: string) => {
    if (user?.role === "admin") return true;
    return userPermissions.includes(permissionTitle);
  };

  const hasAnyPermission = (permissionTitles: string[]) => {
    if (user?.role === "admin") return true;
    return permissionTitles.some((title) => userPermissions.includes(title));
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    isLoading: isUserLoading || isPermissionsLoading || isRolesLoading,
    isAdmin: user?.role === "admin",
  };
};
