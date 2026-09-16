import React from "react";
import { Navigate } from "react-router-dom";
import { useBilling } from "../../hooks/settings/useBilling";
import { PlanAccess } from "../../types/billing";
import { LoadingState } from "../common/LoadingState";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface PlanGuardProps {
  requiredAccess: keyof PlanAccess;
  children: React.ReactNode;
}

const PlanGuard: React.FC<PlanGuardProps> = ({ requiredAccess, children }) => {
  const { data: billingData, isLoading } = useBilling();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = user?.role === "SuperAdmin";

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState />
      </div>
    );
  }

  const hasAccess = billingData?.access ? billingData.access[requiredAccess] !== false : true;

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PlanGuard;
