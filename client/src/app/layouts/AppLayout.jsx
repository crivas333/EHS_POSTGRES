// src/app/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import MainHeader from "@/app/layouts/MainHeader";
import DrawerLeft from "@/app/layouts/DrawerLeft";
import DrawerRight from "@/app/layouts/DrawerRight";
import Main from "@/app/layouts/Main";
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
        <MainHeader
          isMobile={isMobile}
          leftMenuButtonRef={leftMenuButtonRef}
          rightMenuButtonRef={rightMenuButtonRef}
        />

        <DrawerLeft menuButtonRef={leftMenuButtonRef} isMobile={isMobile} />
        
        <Main isMobile={isMobile} openLeft={drawerLeftOpen} openRight={drawerRightOpen}>
          <Outlet />
        </Main>
        
        <DrawerRight menuButtonRef={rightMenuButtonRef} isMobile={isMobile} />
      </Box>

      {/* Footer reutilizable – ahora SÍ se ve */}
      <Footer />

      {/* Espacio para que no tape el contenido */}
      <Box sx={{ height: { xs: 64, sm: 56 } }} />
    </>
  );
}