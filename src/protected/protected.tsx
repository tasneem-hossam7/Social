import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
export default function Protected({ children }: { children: ReactNode }) {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : <>{children}</>;
}
