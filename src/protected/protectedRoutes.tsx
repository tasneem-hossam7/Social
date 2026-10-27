import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  return localStorage.getItem("token") ? <>{children}</> : <Navigate to="/login" replace />;
}
