// src/app/config/drawer-config.js
import {
  PersonAdd,
  EventAvailable,
  Today,
  Biotech,
  Settings,
  Assessment,
} from "@mui/icons-material";

const drawerConfig = [
  {
    title: "GESTIÓN DE PACIENTES",
    icon: PersonAdd,
    stateKey: "openPatient",
    defaultOpen: true,
    items: [
      { to: "/Paciente", label: "Ingreso de Pacientes", icon: PersonAdd },
      { to: "/PacienteTabla", label: "Tabla de Pacientes", icon: PersonAdd },
      { to: "/Agendamiento", label: "Agendamiento", icon: EventAvailable },
      { to: "/Citas", label: "Citas del Día", icon: Today },
    ],
  },
  {
    title: "CONSULTAS",
    icon: Biotech,
    stateKey: "openEncounters",
    defaultOpen: false,
    items: [
      { to: "/EncounterDashboard", label: "Consulta", icon: Biotech },
    ],
  },
  {
    title: "CONFIGURACIÓN",
    icon: Settings,
    stateKey: "openConfig",
    defaultOpen: false,
    items: [
      { to: "/Config", label: "Configuración", icon: Settings },
    ],
  },
  {
    title: "INFORMES",
    icon: Assessment,
    stateKey: "openReports",
    defaultOpen: false,
    items: [
      { to: "/Informes", label: "Informes", icon: Assessment },
    ],
  },
];

export default drawerConfig;