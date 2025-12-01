// src/app/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@app/store/auth-store";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { isAuth, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}