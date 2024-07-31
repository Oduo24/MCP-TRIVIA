import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AuthGuardProps {
  isAuthenticated: boolean;
  role: "admin" | "member";
  requiredRole: "admin" | "member" | null ;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  isAuthenticated,
  role,
  requiredRole,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== requiredRole) {
    return <Navigate to="*" />;
  }

  return <Outlet />;
};

export default AuthGuard;
