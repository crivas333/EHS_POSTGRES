// src/app/config/drawer-right-config.js
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

export default [
  {
    title: "NOTIFICACIONES",
    icon: NotificationsIcon,
    stateKey: "rightNotifications",
    defaultOpen: true,
    items: [
      { to: "/notifications", label: "Alertas", icon: NotificationsIcon },
      { to: "/reminders", label: "Recordatorios", icon: NotificationsIcon },
    ],
  },
  {
    title: "MENSAJES",
    icon: MessageIcon,
    stateKey: "rightMessages",
    defaultOpen: false,
    items: [
      { to: "/messages", label: "Bandeja", icon: MessageIcon },
      { to: "/chat", label: "Chat Interno", icon: MessageIcon },
    ],
  },
  {
    title: "CUENTA",
    icon: AccountCircleIcon,
    stateKey: "rightAccount",
    defaultOpen: false,
    items: [
      { to: "/profile", label: "Mi Perfil", icon: AccountCircleIcon },
      { to: "/settings", label: "Ajustes", icon: SettingsIcon },
    ],
  },
];