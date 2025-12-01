//client/src/app/layouts/AppLayout.jsx - Remove debug styles
import React, { useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { Outlet, useLocation } from "react-router-dom";

import AppBar from "@app/layouts/AppBar";
import DrawerLeft from "@app/layouts/LayoutDrawerLeft";
import DrawerRight from "@app/layouts/LayoutDrawerRight";
import Main from "@app/layouts/LayoutMain";
import { useLayoutStore } from "@app/store/layout-store";

export default function AppLayout() { // Remove children prop
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const {
    drawerLeftOpen,
    drawerRightOpen,
    setDrawerLeftOpen,
    setDrawerRightOpen,
    closeBothDrawers
  } = useLayoutStore();

  const menuButtonLeftRef = useRef(null);
  const menuButtonRightRef = useRef(null);

  // Close drawers on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      closeBothDrawers();
    }
  }, [location.pathname, isMobile, closeBothDrawers]);

  const handleDrawerLeftOpen = () => {
    if (isMobile) setDrawerRightOpen(false);
    setDrawerLeftOpen(true);
  };

  const handleDrawerRightOpen = () => {
    if (isMobile) setDrawerLeftOpen(false);
    setDrawerRightOpen(true);
  };

  const handleDrawerLeftClose = () => {
    setDrawerLeftOpen(false);
    setTimeout(() => menuButtonLeftRef.current?.focus(), 100);
  };

  const handleDrawerRightClose = () => {
    setDrawerRightOpen(false);
    setTimeout(() => menuButtonRightRef.current?.focus(), 100);
  };

  console.log("🏛️ AppLayout: Rendering with navigation");

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />

      <AppBar
        drawerLeftOpen={drawerLeftOpen}
        drawerRightOpen={drawerRightOpen}
        onClickHandleDrawerLeftOpen={handleDrawerLeftOpen}
        onClickHandleDrawerLeftClose={handleDrawerLeftClose}
        onClickHandleDrawerRightOpen={handleDrawerRightOpen}
        onClickHandleDrawerRightClose={handleDrawerRightClose}
        menuButtonLeftRef={menuButtonLeftRef}
        menuButtonRightRef={menuButtonRightRef}
      />

      <DrawerLeft
        drawerOpen={drawerLeftOpen}
        onClickHandleDrawerClose={handleDrawerLeftClose}
        menuButtonRef={menuButtonLeftRef}
        variant={isMobile ? "temporary" : "persistent"}
        ModalProps={{ keepMounted: true }}
      />

      <Main isMobile={isMobile} openLeft={drawerLeftOpen} openRight={drawerRightOpen}>
        <Outlet /> {/* Using Outlet instead of children */}
      </Main>

      <DrawerRight
        drawerOpen={drawerRightOpen}
        onClickHandleDrawerClose={handleDrawerRightClose}
        menuButtonRef={menuButtonRightRef}
        variant={isMobile ? "temporary" : "persistent"}
        ModalProps={{ keepMounted: true }}
      />
    </Box>
  );
}