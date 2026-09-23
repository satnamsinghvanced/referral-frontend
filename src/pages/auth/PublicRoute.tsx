import React, { ReactNode, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Navigate, useSearchParams } from "react-router";
import { logout } from "../../store/authSlice";
import { queryClient } from "../../providers/QueryProvider";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [searchParams] = useSearchParams();
  const addonId = searchParams.get("addonId") || searchParams.get("addon_id") || searchParams.get("addon");
  const redirect = searchParams.get("redirect");
  const fromWp = searchParams.get("from_wp") === "true" || searchParams.get("wp") === "true";
  const isAddonRedirect = Boolean(addonId || fromWp || redirect?.includes("checkout/addon"));

  useEffect(() => {
    // If arriving from WP add-ons while already logged in, log out the current user session so they can sign in fresh
    if (isAuthenticated && isAddonRedirect) {
      dispatch(logout());
      queryClient.clear();
    }
  }, [isAuthenticated, isAddonRedirect, dispatch]);

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

  // If coming from WP addon redirect, do not redirect away with old session; let them see SignIn
  if (isAddonRedirect) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    if (user?.role === "SuperAdmin") {
      return <Navigate to="/admin" replace />;
    }
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;