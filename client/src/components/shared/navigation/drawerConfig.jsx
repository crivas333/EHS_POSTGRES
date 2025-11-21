// drawerConfig.js
import {
  PersonAdd,
  EventAvailable,
  Today,
  Female,
  Biotech,
  Settings,
} from "@mui/icons-material";

const drawerConfig = [
  {
    title: "GESTIÓN DE PACIENTES",
    icon: <PersonAdd />,
    stateKey: "openPatient",
    defaultOpen: true,
    items: [
      { to: "/Paciente", label: "Ingreso de Pacientes", icon: <PersonAdd /> },
      { to: "/PacienteTabla", label: "Table de Pacientes", icon: <PersonAdd /> },
      { to: "/Agendamiento", label: "Agendamiento", icon: <EventAvailable /> },
      { to: "/Citas", label: "Citas del Día", icon: <Today /> },
    ],
  },
  {
    title: "ENCOUNTERS",
    icon: <Female />,
    stateKey: "openGyn",
    defaultOpen: false,
    items: [
      // { to: "/Consulta", label: "Consulta", icon: <Biotech /> },
      // { to: "/Consulta2", label: "Consulta2", icon: <Biotech /> },
      // { to: "/Examenes", label: "Exámenes", icon: <Biotech /> },
      // { to: "/OldDashboard", label: "OldDashboard", icon: <Biotech /> },
      { to: "/PatientDashboard", label: "Patient Dashboard", icon: <Biotech /> },
    ],
  },
  {
    title: "MÓDULO CONFIGURACIÓN",
    icon: <Settings />,
    stateKey: "openConfig",
    defaultOpen: false,
    items: [{ to: "/Config", label: "Configuración", icon: <Settings /> }],
  },
];

export default drawerConfig;
