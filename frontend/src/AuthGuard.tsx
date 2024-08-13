import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  isAuthenticated: boolean;
  role: "admin" | "member";
  requiredRole: "admin" | "member" | null;
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  isAuthenticated,
  role,
  requiredRole,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== requiredRole) {
    return <Navigate to="*" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
