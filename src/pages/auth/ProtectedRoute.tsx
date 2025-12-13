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
      <div className="bg-background flex items-center justify-center p-4">
        <FiLoader className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/signin" replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
