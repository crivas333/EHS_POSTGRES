// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/state/zustand/ZustandStore";
import { useSession } from "@/hooks/useSession";

export default function ProtectedRoute({ redirectTo = "/" }) {
  const { isAuth } = useAuthStore();
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Checking session…</h2>
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
