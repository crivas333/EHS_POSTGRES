// src/app/router/routes.jsx
import { lazy } from "react";
import LazyRoute from "@app/router/LazyRoute";

// EAGER: Core pages → INSTANT navigation
import PatientPage from "@/pages/PatientPage";
import PatientTablePage from "@pages/PatientTablePage";
import CalendarPage from "@/pages/CalendarPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import EncounterPage from "@features/encounters/dashboard/EncounterDashboard";
import SystemConfigPage from "@/pages/SystemConfigPage";
import ReportsPage from "@/pages/ReportsPage";

// LAZY: Only login + 404
const Login = lazy(() => import("@/pages/LoginPage"));
const NotFound = lazy(() => import("@/pages/NotFoundPage"));

export const publicRoutes = [
  {
    path: "/login",
    element: <LazyRoute component={Login} />,
  },
];

export const protectedRoutes = [
  { index: true, element: <PatientPage /> },
  { path: "Paciente", element: <PatientPage /> },
  { path: "PacienteTabla", element: <PatientTablePage /> },
  { path: "Agendamiento", element: <CalendarPage /> },
  { path: "Citas", element: <AppointmentsPage /> },
  { path: "EncounterDashboard", element: <EncounterPage /> },
  { path: "Config", element: <SystemConfigPage /> },
  { path: "Informes", element: <ReportsPage /> },
  { path: "*", element: <LazyRoute component={NotFound} /> },
];