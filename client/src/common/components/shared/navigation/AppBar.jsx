
//client/src/components/shared/navigation//ResponsiveAppBar.jsx
import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useThemeMode } from "@/state/context/useThemeMode";
import PatientSummary from "@/features/patient/ui/PatientSummary";
import { useAppBarHeight } from "@/constants/layout";

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    !["drawerLeftOpen", "drawerRightOpen", "isMobile"].includes(prop),
})(({ theme, drawerLeftOpen, drawerRightOpen, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  ...(isMobile
    ? {}
    : {
        marginLeft: drawerLeftOpen ? drawerWidth : 0,
        marginRight: drawerRightOpen ? drawerWidth : 0,
        width: `calc(100% - ${
          (drawerLeftOpen ? drawerWidth : 0) + (drawerRightOpen ? drawerWidth : 0)
        }px)`,
      }),
}));

function ResponsiveAppBar({
  drawerLeftOpen,
  drawerRightOpen,
  onClickHandleDrawerLeftOpen,
  onClickHandleDrawerLeftClose,
  onClickHandleDrawerRightOpen,
  onClickHandleDrawerRightClose,
  isMobile,
}) {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { mode, toggleMode } = useThemeMode();
  const menuButtonRef = useRef(null);
  const appBarHeight = useAppBarHeight();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  const handleRightDrawerToggle = () => {
    drawerRightOpen
      ? onClickHandleDrawerRightClose()
      : onClickHandleDrawerRightOpen();
  };

  return (
    <StyledAppBar
      position="fixed"
      elevation={3}
      drawerLeftOpen={drawerLeftOpen}
      drawerRightOpen={drawerRightOpen}
      isMobile={isMobile}
      sx={{ height: appBarHeight }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: appBarHeight,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            ref={menuButtonRef}
            color="inherit"
            edge="start"
            onClick={() =>
              drawerLeftOpen
                ? onClickHandleDrawerLeftClose()
                : onClickHandleDrawerLeftOpen()
            }
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              color: "inherit",
              maxWidth: 300,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
            }}
          >
            <PatientSummary />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={`Modo ${mode === "light" ? "oscuro" : "claro"}`}>
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Cerrar sesión">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Panel derecho">
            <IconButton color="inherit" onClick={handleRightDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default ResponsiveAppBar;