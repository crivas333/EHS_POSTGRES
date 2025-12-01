// src/app/layouts/Footer.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Divider, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={2}
      sx={{
        top: "auto",
        bottom: 0,
        bgcolor: "background.paper",
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <Toolbar variant="dense" sx={{ justifyContent: "center", minHeight: "48px !important", py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          © {new Date().getFullYear()} EHS System
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography variant="caption" color="text.secondary">
          v2.1.4
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Todos los derechos reservados
        </Typography>
      </Toolbar>
    </AppBar>
  );
}