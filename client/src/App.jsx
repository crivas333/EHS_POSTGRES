// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./state/zustand/ZustandStore";
import { useSession } from "@/hooks/useSession";
import Login from "./pages/Login.jsx";
import Pages from "./pages";
import LoadingScreen from "@/components/shared/ui/LoadingScreen";
import "./App.css";

// 🔒 Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuth } = useAuthStore();
  return isAuth ? children : <Navigate to="/login" replace />;
}

// 🌐 Public Route wrapper
function PublicRoute({ children }) {
  const { isAuth } = useAuthStore();
  return isAuth ? <Navigate to="/Paciente" replace /> : children;
}

function App() {
  const { isLoading } = useSession();
  const { isAuth } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen message="Checking session…" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route (redirects if already logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Default landing page (root path) */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/Paciente" : "/login"} replace />}
        />

        {/* Protected app pages */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
