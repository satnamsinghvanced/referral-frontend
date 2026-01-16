import React, { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  //   const { isAuthenticated, isLoading } = useAuth();

  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-4">
        <FiLoader className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm text-foreground/60 animate-pulse">
          Loading your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
