// src/app/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import ApplicationBar from "@/app/layouts/AppBar";
import LayoutDrawerLeft from "@/app/layouts/LayoutDrawerLeft";
import LayoutDrawerRight from "@/app/layouts/LayoutDrawerRight";
import LayoutMain from "@/app/layouts/LayoutMain";
import Footer from "@/app/layouts/Footer";           // ← Nuevo
import { useLayoutStore } from "@app/store/layout-store";

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { drawerLeftOpen, drawerRightOpen } = useLayoutStore();

  const leftMenuButtonRef = React.useRef(null);
  const rightMenuButtonRef = React.useRef(null);

  return (
    <>
      {/* Tu layout original – 100% intacto */}
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <ApplicationBar
          isMobile={isMobile}
          leftMenuButtonRef={leftMenuButtonRef}
          rightMenuButtonRef={rightMenuButtonRef}
        />

        <LayoutDrawerLeft menuButtonRef={leftMenuButtonRef} isMobile={isMobile} />
        
        <LayoutMain isMobile={isMobile} openLeft={drawerLeftOpen} openRight={drawerRightOpen}>
          <Outlet />
        </LayoutMain>
        
        <LayoutDrawerRight menuButtonRef={rightMenuButtonRef} isMobile={isMobile} />
      </Box>

      {/* Footer reutilizable – ahora SÍ se ve */}
      <Footer />

      {/* Espacio para que no tape el contenido */}
      <Box sx={{ height: { xs: 64, sm: 56 } }} />
    </>
  );
}