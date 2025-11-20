// src/layouts/Main.jsx
import React from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const drawerWidth = 240;

const MainRoot = styled("main", {
  shouldForwardProp: (prop) =>
    prop !== "openLeft" && prop !== "openRight" && prop !== "isMobile",
})(({ theme, openLeft, openRight, isMobile }) => {
  // 📱 Mobile — both drawers overlay, so full width
  if (isMobile) {
    return {
      flexGrow: 1,
      width: "100%",
      padding: theme.spacing(2),
      overflow: "auto",
      boxSizing: "border-box",
    };
  }

  // 🖥️ Desktop — both drawers are persistent
  const transitionBase = {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  };

  const transitionOpen = {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  };

  return {
    flexGrow: 1,
    width: "100%",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflow: "auto",
    boxSizing: "border-box",
    transition: theme.transitions.create(
      ["margin-left", "margin-right"],
      transitionBase
    ),

    // ✅ Shift for left drawer
    marginLeft: openLeft ? 0 : -drawerWidth,
    ...(openLeft && {
      transition: theme.transitions.create("margin-left", transitionOpen),
    }),

    // ✅ Shift for right drawer (symmetric)
    marginRight: openRight ? 0 : -drawerWidth,
    ...(openRight && {
      transition: theme.transitions.create("margin-right", transitionOpen),
    }),
  };
});

export default function Main({
  children,
  isMobile,
  openLeft,
  openRight,
  maxWidth = false,
  spacing = 2,
}) {
  const childrenCount = React.Children.count(children);
  const mdSize =
    childrenCount > 1 ? Math.max(Math.floor(12 / childrenCount), 3) : 12;
  const lgSize =
    childrenCount > 1 ? Math.max(Math.floor(12 / childrenCount), 2) : 12;
  const xlSize =
    childrenCount > 1 ? Math.max(Math.floor(12 / childrenCount), 1) : 12;

  return (
    <MainRoot isMobile={isMobile} openLeft={openLeft} openRight={openRight}>
      {/* Spacer for fixed AppBar height */}
      <Toolbar />

      <Container
        disableGutters
        maxWidth={maxWidth}
        sx={{
          flex: 1,
          py: 2,
          px: 3,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {childrenCount > 1 ? (
          <Grid container spacing={spacing}>
            {React.Children.map(children, (child, i) => (
              <Grid
                key={i}
                item
                xs={12}
                md={mdSize}
                lg={lgSize}
                xl={xlSize}
              >
                {child}
              </Grid>
            ))}
          </Grid>
        ) : (
          children
        )}
      </Container>
    </MainRoot>
  );
}
