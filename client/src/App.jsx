//client/src/App.jsx
import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "@app/store/auth-store";
import { protectedRoutes, publicRoutes } from "@app/router/routes";
import ProtectedRoute from "@app/router/ProtectedRoute";
import AppLayout from "@/app/layouts/AppLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";
import ErrorBoundary from "@app/components/ErrorBoundary"; // Use your proper one

// Fallback while lazy components load
const LazyFallback = () => (
  <LoadingScreen message="Cargando módulo..." />
);

function App() {
  const { isAuth, isLoading, initializeAuth } = useAuthStore();

  // Initialize auth on mount (idb token, etc.)
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show full-screen loader during auth init
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
              element={
                isAuth ? <Navigate to="/Paciente" replace /> : element}
            />
          ))}

          {/* AuthLayout (Login) */}
          <Route
            path="/login"
            element={
              isAuth ? <Navigate to="/Paciente" replace /> : <AuthLayout />
            }
          />

          {/* Protected Area - All routes under AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AppLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          >
            {/* Default route */}
            <Route index element={<Navigate to="/Paciente" replace />} />

            {/* Dynamically render all protected pages */}
            {protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Catch-all inside protected area */}
            <Route path="*" element={<Navigate to="/Paciente" replace />} />
          </Route>

          {/* Global catch-all (should never hit if above are correct) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;