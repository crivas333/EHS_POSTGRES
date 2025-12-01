//client/src/app/layouts/LayoutDrawerRight.jsx
import React, { useRef, useEffect } from "react";
import {
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

// Import icons as components
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

// Right drawer configuration - similar structure to left drawer
const rightDrawerConfig = [
  {
    title: "NOTIFICACIONES",
    icon: NotificationsIcon,
    stateKey: "openNotifications",
    defaultOpen: true,
    items: [
      { to: "/notifications", label: "Alertas del Sistema", icon: NotificationsIcon },
      { to: "/reminders", label: "Recordatorios", icon: NotificationsIcon },
    ],
  },
  {
    title: "COMUNICACIÓN",
    icon: MessageIcon,
    stateKey: "openCommunication", 
    defaultOpen: false,
    items: [
      { to: "/messages", label: "Mensajes", icon: MessageIcon },
      { to: "/inbox", label: "Bandeja de Entrada", icon: MessageIcon },
    ],
  },
  {
    title: "CUENTA",
    icon: AccountCircleIcon,
    stateKey: "openAccount",
    defaultOpen: false,
    items: [
      { to: "/profile", label: "Perfil de Usuario", icon: AccountCircleIcon },
      { to: "/settings", label: "Configuración", icon: SettingsIcon },
      { to: "/preferences", label: "Preferencias", icon: SettingsIcon },
    ],
  },
];

export default function DrawerRight({
  window,
  drawerOpen,
  onClickHandleDrawerClose,
  menuButtonRef,
  variant = "persistent",
  ModalProps = {},
}) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize open states from config - NOW USED
  const initialOpenStates = rightDrawerConfig.reduce((acc, section) => {
    acc[section.stateKey] = section.defaultOpen;
    return acc;
  }, {});
  const [openStates, setOpenStates] = React.useState(initialOpenStates);

  const firstItemRef = useRef(null);

  const toggleSection = (stateKey) => {
    setOpenStates((prev) => ({ ...prev, [stateKey]: !prev[stateKey] }));
  };

  // Restore focus to menu button on drawer close (mobile only)
  useEffect(() => {
    if (!drawerOpen && isMobile) {
      menuButtonRef?.current?.focus();
    }
  }, [drawerOpen, menuButtonRef, isMobile]);

  // Helper function to render icon components consistently
  const renderIcon = (IconComponent) => {
    if (!IconComponent) return null;
    return <IconComponent fontSize="small" />;
  };

  const renderNestedItem = (to, label, IconComponent = null, ref = null, autoFocus = false) => (
    <ListItem disablePadding key={to}>
      <ListItemButton
        ref={ref}
        component={NavLink}
        to={to}
        selected={location.pathname === to}
        onClick={() => {
          if (isMobile) onClickHandleDrawerClose();
        }}
        autoFocus={autoFocus && isMobile}
        sx={{
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
          },
          pl: 4, // Indent nested items
        }}
      >
        <ListItemIcon>{renderIcon(IconComponent)}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <strong>Panel Lateral</strong>
      </Box>
      
      <List component="nav" sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {rightDrawerConfig.map((section, idx) => (
          <React.Fragment key={section.title}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => toggleSection(section.stateKey)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  {renderIcon(section.icon)}
                </ListItemIcon>
                <ListItemText 
                  primary={section.title} 
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                  }}
                />
                {openStates[section.stateKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={openStates[section.stateKey]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item, i) =>
                  renderNestedItem(
                    item.to,
                    item.label,
                    item.icon,
                    idx === 0 && i === 0 ? firstItemRef : null,
                    idx === 0 && i === 0
                  )
                )}
              </List>
            </Collapse>
            
            {idx < rightDrawerConfig.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const container = window ? () => window().document.body : undefined;

  return (
    <Drawer
      anchor="right"
      variant={variant}
      open={drawerOpen}
      onClose={onClickHandleDrawerClose}
      ModalProps={{
        ...ModalProps,
        ...(isMobile && {
          slotProps: {
            transition: {
              onEntered: () => {
                firstItemRef.current?.focus();
              },
            },
          },
        }),
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: variant === "persistent" ? "relative" : "fixed",
          bgcolor: theme.palette.background.paper,
          borderLeft: variant === "persistent" ? `1px solid ${theme.palette.divider}` : 'none',
        },
      }}
      container={isMobile ? container : undefined}
    >
      {drawerContent}
    </Drawer>
  );
}