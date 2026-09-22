import React, { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Navigate, useSearchParams } from "react-router";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [searchParams] = useSearchParams();
  const addonId = searchParams.get("addonId") || searchParams.get("addon_id") || searchParams.get("addon");
  const redirect = searchParams.get("redirect");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-4">
        <FiLoader className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm text-foreground/60 animate-pulse">
          Loading your session...
        </p>
      </div>
    );
  }
  if (isAuthenticated) {
    if (user?.role === "SuperAdmin") {
      return <Navigate to="/admin" replace />;
    }
    if (addonId) {
      return <Navigate to={`/checkout/addon?addonId=${addonId}`} replace />;
    }
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;