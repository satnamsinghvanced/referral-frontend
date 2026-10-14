import React from "react";
import { Navigate } from "react-router-dom";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import { LoadingState } from "../common/LoadingState";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isLoading, isAdmin } = useRolePermissions();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = user?.role === "SuperAdmin";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState />
      </div>
    );
  }
  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default AdminGuard;