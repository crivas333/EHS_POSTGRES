// src/app/router/routes.jsx
import { lazy } from "react";
import LazyRoute from "./LazyRoute";

// EAGER: Core pages → INSTANT navigation
import PatientView from "@pages/PatientView";
import PatientTablePage from "@pages/PatientTablePage";
import CalendarView from "@pages/CalendarView";
import AppointmentsView from "@pages/AppointmentsView";
import EncounterDashboard from "@features/encounters/dashboard/EncounterDashboard";
import SystemConfigView from "@pages/SystemConfigView";
import ReportsView from "@pages/ReportsView";

// LAZY: Only login + 404
const Login = lazy(() => import("@pages/Login"));
const NotFound = lazy(() => import("@pages/NotFound"));

export const publicRoutes = [
  {
    path: "/login",
    element: <LazyRoute component={Login} />,
  },
];

export const protectedRoutes = [
  { index: true, element: <PatientView /> },
  { path: "Paciente", element: <PatientView /> },
  { path: "PacienteTabla", element: <PatientTablePage /> },
  { path: "Agendamiento", element: <CalendarView /> },
  { path: "Citas", element: <AppointmentsView /> },
  { path: "EncounterDashboard", element: <EncounterDashboard /> },
  { path: "Config", element: <SystemConfigView /> },
  { path: "Informes", element: <ReportsView /> },
  { path: "*", element: <LazyRoute component={NotFound} /> },
];