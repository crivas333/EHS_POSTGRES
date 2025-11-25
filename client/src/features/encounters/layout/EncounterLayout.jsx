
// src/features/encounters/layout/EncounterLayout.jsx
import React from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

const MODULES = [
  { key: "encounters", title: "Encounters", icon: "📋" },
  { key: "visualAcuity", title: "Visual Acuity", icon: "👁️" },
  { key: "refraction", title: "Refraction", icon: "🔍" },
  { key: "exams", title: "Exams", icon: "🩺" },
  { key: "notes", title: "Clinical Notes", icon: "📝" },
  { key: "orders", title: "Orders", icon: "💊" },
];

export default function EncounterLayout({
  //selectedEncounterId,
  isMobile,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  children,
  SidebarComponent,
}) {
  const sidebarContent = (
    <Box sx={{ p: isMobile ? 1 : 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Clinical Tools
      </Typography>

      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setMobileSidebarOpen(false)} size="small">
            <Menu />
          </IconButton>
        </Box>
      )}

      {/* NEW: sidebar passed from EncounterDashboard */}
      {SidebarComponent}
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileSidebarOpen(true)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>
              Clinical Tools
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {!isMobile && (
          <Box
            sx={{
              width: 250,
              borderRight: 1,
              borderColor: "divider",
              overflow: "auto",
              bgcolor: "grey.50",
            }}
          >
            {sidebarContent}
          </Box>
        )}

        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 280,
                boxSizing: "border-box",
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}

        <Box sx={{ flex: 1, p: isMobile ? 1 : 3, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
