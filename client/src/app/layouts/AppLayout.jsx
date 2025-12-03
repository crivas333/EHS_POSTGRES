// src/app/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import Header from "@/app/layouts/Header";
import DrawerLeft from "@/app/layouts/DrawerLeft"; // Fixed name
import DrawerRight from "@/app/layouts/DrawerRight"; // Fixed name
import Main from "@/app/layouts/Main";
import Footer from "@/app/layouts/Footer";
import { useLayoutStore } from "@app/store/layout-store";

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { drawerLeftOpen, drawerRightOpen } = useLayoutStore();

  const leftMenuButtonRef = React.useRef(null);
  const rightMenuButtonRef = React.useRef(null);

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh", 
      bgcolor: "background.default" 
    }}>
      {/* Header */}
      <Header
        isMobile={isMobile}
        leftMenuButtonRef={leftMenuButtonRef}
        rightMenuButtonRef={rightMenuButtonRef}
      />

      {/* Main Content Area with Drawers */}
      <Box sx={{ 
        display: "flex", 
        flex: 1,
        position: "relative" 
      }}>
        <DrawerLeft 
          menuButtonRef={leftMenuButtonRef} 
          isMobile={isMobile}
          window={window} // Added window prop
        />
        
        <Main 
          isMobile={isMobile} 
          openLeft={drawerLeftOpen} 
          openRight={drawerRightOpen}
        >
          <Outlet />
        </Main>
        
        <DrawerRight 
          menuButtonRef={rightMenuButtonRef} 
          isMobile={isMobile}
          window={window} // Added window prop
        />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}