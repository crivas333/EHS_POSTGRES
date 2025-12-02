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
import PreloadAppConfig from "@app/components/PreloadAppConfig";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";
import ErrorBoundary from "@app/components/ErrorBoundary";

const LazyFallback = () => <LoadingScreen message="Cargando módulo..." />;

export default function App() {
  const { isAuth, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();

    // Limpieza de token expirado o corrupto al iniciar la app
    const token = localStorage.getItem("authToken");
    if (token && token !== "null" && token !== "undefined") {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          console.log("Token expirado eliminado al iniciar");
        }
      } catch {
        // Si el token está mal formado → eliminarlo
        localStorage.removeItem("authToken");
        console.log("Token corrupto eliminado");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Array vacío correcto: solo se ejecuta una vez al montar

  if (isLoading) {
    return <LoadingScreen message="Inicializando aplicación..." />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <ErrorBoundary>
          <Routes>
            {/* Rutas públicas */}
            {publicRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={isAuth ? <Navigate to="/Paciente" replace /> : element}
              />
            ))}

            {/* Área protegida */}
            <Route
              element={
                <ProtectedRoute>
                  <PreloadAppConfig>
                    <ErrorBoundary>
                      <AppLayout />
                    </ErrorBoundary>
                  </PreloadAppConfig>
                </ProtectedRoute>
              }
            >
              {protectedRoutes.map((route) => (
                <Route key={route.path || "root"} {...route} />
              ))}
            </Route>

            {/* Catch-all */}
            <Route
              path="*"
              element={<Navigate to={isAuth ? "/Paciente" : "/login"} replace />}
            />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}