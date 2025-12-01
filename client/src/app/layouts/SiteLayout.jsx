
import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

import AppBar from "@/common/components/layout/navigation/AppBar";
import DrawerLeft from "@/common/components/layout/navigation/DrawerLeft";
import DrawerRight from "@/common/components/layout/navigation/DrawerRight";
import Main from "@/layouts/Main";

export default function SiteLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log("🏛️ SiteLayout: Component rendering", { isMobile, children: !!children });

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
        overflow: "hidden",
        bgcolor: "background.default",
        border: "5px solid red", // Add visible border
      }}
    >
      <CssBaseline />

      {/* Add visible debug element */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        zIndex: 9999
      }}>
        🏛️ SITE LAYOUT RENDERING
      </div>

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
        {/* Add main content debug */}
        <div style={{
          backgroundColor: 'yellow',
          padding: '20px',
          border: '3px solid blue',
          minHeight: '200px'
        }}>
          <h2>MAIN CONTENT AREA</h2>
          <p>Children received: {children ? 'YES' : 'NO'}</p>
          {children}
        </div>
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