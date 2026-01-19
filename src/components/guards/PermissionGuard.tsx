import React from "react";
import { Navigate } from "react-router-dom";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import { LoadingState } from "../common/LoadingState";

interface PermissionGuardProps {
  permissions: string[];
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  children,
}) => {
  const { hasAnyPermission, isLoading, isAdmin } = useRolePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState />
      </div>
    );
  }

  // Admin always has access
  if (isAdmin) {
    return <>{children}</>;
  }

  const hasAccess = hasAnyPermission(permissions);

  if (!hasAccess) {
    // Redirect to home or a dedicated "Unauthorized" page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
