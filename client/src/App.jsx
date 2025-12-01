
// client/src/App.jsx
import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthStore } from "@app/store/auth-store";
import { publicRoutes, protectedRoutes } from "@app/router/routes";
import ProtectedRoute from "@app/router/ProtectedRoute";
import AppLayout from "@/app/layouts/AppLayout";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";
import ErrorBoundary from "@app/components/ErrorBoundary";

const LazyFallback = () => <LoadingScreen message="Cargando módulo..." />;

export default function App() {
  const { isAuth, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Inicializando aplicación..." />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={isAuth ? <Navigate to="/Paciente" replace /> : element}
            />
          ))}

          {/* Protected Area */}
          <Route
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AppLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          >
            {protectedRoutes.map((route, index) => (
              <Route key={route.path || index} {...route} />
            ))}
          </Route>

          {/* Global catch-all */}
          <Route
            path="*"
            element={<Navigate to={isAuth ? "/Paciente" : "/login"} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}