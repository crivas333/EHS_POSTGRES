import { lazy } from 'react';
import LazyRoute from './LazyRoute';

// Lazy load all pages - MATCH YOUR OLD PAGES COMPONENTS
const PatientView = lazy(() => import('@pages/PatientView'));
const PatientTablePage = lazy(() => import('@pages/PatientTablePage'));
const CalendarView = lazy(() => import('@pages/CalendarView'));
const AppointmentsView = lazy(() => import('@pages/AppointmentsView'));
const EncounterDashboard = lazy(() => import('@features/encounters/dashboard/EncounterDashboard'));
const SystemConfigView = lazy(() => import('@pages/SystemConfigView'));
const ReportsView = lazy(() => import('@pages/ReportsView'));
const Login = lazy(() => import('@pages/Login'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Public routes
export const publicRoutes = [
  {
    path: '/login',
    element: <LazyRoute component={Login} />,
  },
];

// Protected routes - EXACTLY MATCH YOUR DRAWER CONFIG PATHS
export const protectedRoutes = [
  // Patient Management Routes (from your drawer config)
  {
    path: '/Paciente',
    element: <LazyRoute component={PatientView} />,
    title: 'Ingreso de Pacientes',
  },
  {
    path: '/PacienteTabla', 
    element: <LazyRoute component={PatientTablePage} />,
    title: 'Tabla de Pacientes',
  },
  {
    path: '/Agendamiento',
    element: <LazyRoute component={CalendarView} />, // This was CalendarView in your old code
    title: 'Agendamiento',
  },
  {
    path: '/Citas',
    element: <LazyRoute component={AppointmentsView} />, // This was AppointmentsView in your old code
    title: 'Citas del Día',
  },
  
  // Encounters Routes (from your drawer config)
  {
    path: '/EncounterDashboard',
    element: <LazyRoute component={EncounterDashboard} />,
    title: 'Consulta',
  },
  
  // Configuration Routes (from your drawer config)
  {
    path: '/Config',
    element: <LazyRoute component={SystemConfigView} />,
    title: 'Configuración',
  },
  
  // Additional routes from your old Pages component
  {
    path: '/Informes',
    element: <LazyRoute component={ReportsView} />,
    title: 'Informes',
  },
];

// Utility function to get route title
export const getRouteTitle = (pathname) => {
  const route = protectedRoutes.find(route => route.path === pathname);
  return route?.title || 'EHS System';
};