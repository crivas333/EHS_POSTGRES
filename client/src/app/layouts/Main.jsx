// src/app/layouts/Main.jsx
import React from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

const DRAWER_WIDTH = 240;

const MainStyled = styled("main", {
  shouldForwardProp: (prop) =>
    !["openLeft", "openRight", "isMobile"].includes(prop),
})(({ theme, openLeft, openRight, isMobile }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // Altura total menos AppBar (64px en desktop, 56px en mobile)
  minHeight: "100vh",
  paddingTop: theme.mixins.toolbar.minHeight, // Reemplaza el <Toolbar />

  // Scroll solo en el contenido (no en todo el main)
  overflow: "hidden",

  transition: theme.transitions.create(["margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  // Mobile: drawers overlay → no margin
  ...(isMobile
    ? { padding: theme.spacing(2, 2, 8, 2) } // bottom padding para FABs o botones
    : {
        marginLeft: openLeft ? 0 : -DRAWER_WIDTH,
        marginRight: openRight ? 0 : -DRAWER_WIDTH,
        ...(openLeft && {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
        ...(openRight && {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }),
}));

const Content = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",     // Aquí está el scroll!
  overflowX: "hidden",
  padding: theme.spacing(2),
  // Opcional: scroll suave
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch", // iOS smooth scroll
}));

export default function Main({
  children,
  isMobile = false,
  openLeft = false,
  openRight = false,
}) {
  return (
    <MainStyled openLeft={openLeft} openRight={openRight} isMobile={isMobile}>
      {/* Ya no necesitas <Toolbar /> → el paddingTop lo maneja el Main */}
      <Content>
        {children}
      </Content>
    </MainStyled>
  );
}