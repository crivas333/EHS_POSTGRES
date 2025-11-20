
// src/layouts/SiteLayout.jsx
import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

import AppBar from "@/components/shared/navigation/AppBar";
import DrawerLeft from "@/components/shared/navigation/DrawerLeft";
import DrawerRight from "@/components/shared/navigation/DrawerRight";
import Main from "@/layouts/Main";

export default function SiteLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
  const [drawerRightOpen, setDrawerRightOpen] = useState(false);

  const menuButtonLeftRef = useRef(null);
  const menuButtonRightRef = useRef(null);

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
    menuButtonLeftRef.current?.focus();
  };

  const handleDrawerRightClose = () => {
    setDrawerRightOpen(false);
    menuButtonRightRef.current?.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden", // ✅ prevent layout from scrolling under NavBar
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
        {children}
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
