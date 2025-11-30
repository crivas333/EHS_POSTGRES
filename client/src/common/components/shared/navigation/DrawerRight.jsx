
// src/components/NavBar/DrawerRight.jsx
import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

export default function DrawerRight({
  drawerOpen,
  onClickHandleDrawerClose,
  //menuButtonRef,
  variant = "persistent",
  ModalProps = {},
}) {
  return (
    <Drawer
      anchor="right"
      variant={variant}
      open={drawerOpen}
      onClose={onClickHandleDrawerClose}
      ModalProps={ModalProps}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: variant === "persistent" ? "relative" : "fixed",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <strong>Panel</strong>
      </Box>
      <Divider />

      <List>
        {[
          { text: "Notificaciones", icon: <NotificationsIcon /> },
          { text: "Mensajes", icon: <MessageIcon /> },
          { text: "Cuenta", icon: <AccountCircleIcon /> },
        ].map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={onClickHandleDrawerClose}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
