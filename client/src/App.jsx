// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./state/zustand/ZustandStore";
import Login from "./pages/Login.jsx";
import Pages from "./pages";
import LoadingScreen from "@/common/components/shared/ui/LoadingScreen";

function App() {
  const { isAuth, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen message="Cargando sesión…" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/Paciente" /> : <Login />} />
        <Route path="/" element={<Navigate to={isAuth ? "/Paciente" : "/login"} />} />
        <Route path="/*" element={isAuth ? <Pages /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;