//src/app/config/drawer-config.js
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
    icon: PersonAdd, // Use component reference, not JSX
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
    title: "ENCOUNTERS", 
    icon: Female,
    stateKey: "openGyn",
    defaultOpen: false,
    items: [
      { to: "/EncounterDashboard", label: "Consulta", icon: Biotech },
    ],
  },
  {
    title: "MÓDULO CONFIGURACIÓN",
    icon: Settings,
    stateKey: "openConfig", 
    defaultOpen: false,
    items: [{ to: "/Config", label: "Configuración", icon: Settings }],
  },
];

export default drawerConfig;