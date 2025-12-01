//src/app/layouts/LayoutMain.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const drawerWidth = 240;

const MainRoot = styled("main", {
  shouldForwardProp: (prop) =>
    !["openLeft", "openRight", "isMobile"].includes(prop),
})(({ theme, openLeft, openRight, isMobile }) => {
  if (isMobile) {
    return {
      flexGrow: 1,
      width: "100%",
      padding: theme.spacing(2),
      overflow: "auto",
      boxSizing: "border-box",
    };
  }

  const transition = theme.transitions.create(
    ["margin-left", "margin-right", "width"],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }
  );

  return {
    flexGrow: 1,
    width: "100%",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflow: "auto",
    boxSizing: "border-box",
    transition,

    // Left drawer adjustments
    marginLeft: openLeft ? 0 : -drawerWidth,
    ...(openLeft && {
      transition: theme.transitions.create(["margin-left", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),

    // Right drawer adjustments
    marginRight: openRight ? 0 : -drawerWidth,
    ...(openRight && {
      transition: theme.transitions.create(["margin-right", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});

// Route-specific layout configurations - FIXED: Remove unused variable
const routeLayoutConfig = {
  '/calendario': { maxWidth: false, spacing: 0 },
  '/pacientes': { maxWidth: 'xl', spacing: 3 },
  '/configuracion': { maxWidth: 'lg', spacing: 2 },
  // Add more route-specific configurations
};

export default function Main({
  children,
  isMobile,
  openLeft,
  openRight,
  spacing,
  maxWidth,
}) {
  const location = useLocation();
  
  // Get route-specific configuration or use defaults - FIXED: Use the correct variable name
  const routeConfig = routeLayoutConfig[location.pathname] || {};
  const finalMaxWidth = maxWidth ?? routeConfig.maxWidth ?? 'xl';
  const finalSpacing = spacing ?? routeConfig.spacing ?? 2;

  const childrenCount = React.Children.count(children);
  const gridSize = childrenCount > 1 
    ? Math.max(Math.floor(12 / childrenCount), { xs: 12, sm: 6, md: 4, lg: 3 }[isMobile ? 'xs' : 'md'])
    : 12;

  return (
    <MainRoot isMobile={isMobile} openLeft={openLeft} openRight={openRight}>
      <Toolbar /> {/* Spacer for AppBar */}

      <Container
        disableGutters={isMobile}
        maxWidth={finalMaxWidth}
        sx={{
          flex: 1,
          py: finalSpacing,
          px: isMobile ? 2 : 3,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {childrenCount > 1 ? (
          <Grid container spacing={finalSpacing}>
            {React.Children.map(children, (child, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={gridSize}
                sx={{ display: "flex" }}
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