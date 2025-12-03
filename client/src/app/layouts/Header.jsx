// client/src/app/layouts/Header.jsx
import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useThemeMode } from "@/state/context/useThemeMode";
import PatientSummary from "@/features/patient/ui/PatientSummary";
import { useAppBarHeight } from "@/constants/layout";
import { useLayoutStore } from "@app/store/layout-store";

const DRAWER_WIDTH = 240;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    !["openLeft", "openRight", "isMobile"].includes(prop),
})(({ theme, openLeft, openRight, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isMobile
    ? {}
    : {
        marginLeft: openLeft ? DRAWER_WIDTH : 0,
        marginRight: openRight ? DRAWER_WIDTH : 0,
        width: `calc(100% - ${(openLeft ? DRAWER_WIDTH : 0) + (openRight ? DRAWER_WIDTH : 0)}px)`,
      }),
}));

export default function Header({ isMobile = false }) {
  const { mode, toggleMode } = useThemeMode();
  const appBarHeight = useAppBarHeight();
  const { drawerLeftOpen, drawerRightOpen, toggleDrawerLeft, toggleDrawerRight } =
    useLayoutStore();

  return (
    <StyledAppBar
      position="fixed"
      openLeft={drawerLeftOpen}
      openRight={drawerRightOpen}
      isMobile={isMobile}
      sx={{ height: appBarHeight }}
      color="primary"
      elevation={2}
    >
      <Toolbar sx={{ minHeight: appBarHeight, px: { xs: 1, sm: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">

          {/* LEFT SIDE */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tooltip title={drawerLeftOpen ? "Ocultar menú" : "Mostrar menú"}>
              <IconButton color="inherit" edge="start" onClick={toggleDrawerLeft}>
                {drawerLeftOpen ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                maxWidth: { xs: 180, sm: 300, md: 400 },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 500,
              }}
            >
              <PatientSummary />
            </Box>
          </Stack>

          {/* RIGHT SIDE – PERFECTAMENTE UNIFORME */}
          <Stack direction="row" spacing={0.5}>
            {/* Theme Toggle */}
            <Tooltip title={`Cambiar a modo ${(mode === "light" ? "oscuro" : "claro")}`}>
              <IconButton color="inherit" onClick={toggleMode}>
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>

            {/* Panel Derecho – solo escritorio */}
            {(
              <Tooltip
                title={drawerRightOpen ? "Ocultar panel derecho" : "Mostrar panel derecho"}
              >
                <IconButton color="inherit" onClick={toggleDrawerRight}>
                  {drawerRightOpen ? <ViewSidebarOutlinedIcon /> : <ViewSidebarIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
}

