//src/app/router/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@app/store/auth-store';
import LoadingScreen from '@common/components/ui/feedback/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuth, isLoading } = useAuthStore();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute:", { isAuth, isLoading, path: location.pathname });

  if (isLoading) {
    console.log("⏳ ProtectedRoute: Still loading");
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  if (!isAuth) {
    console.log("🔐 ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ ProtectedRoute: User authenticated, rendering children");
  return children;
};

export default ProtectedRoute;