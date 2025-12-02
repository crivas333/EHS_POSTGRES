// client/src/app/layouts/Profile.jsx
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import { useAppBarHeight } from "@/constants/layout";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@app/store/auth-store";

const Profile = () => {
  const theme = useTheme();
  const appBarHeight = useAppBarHeight();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { user } = useAuthStore();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  };

  if (!user) {
    return null;
  }

  const displayName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.userName ||
    "Usuario";

  const role = user.role || "Sin rol";
  const avatarUrl = user.avatar || null;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      {/* FONDO AZUL PRIMARIO EXACTO IGUAL AL MAINHEADER */}
      <Box
        onClick={handleClick}
        sx={{
          height: appBarHeight,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          // FONDO 100% IGUAL AL APPBAR → usa el color del tema
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          cursor: "pointer",
          transition: theme.transitions.create("background-color"),
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={displayName}
          sx={{
            width: 38,
            height: 38,
            bgcolor: avatarUrl ? "transparent" : theme.palette.info.light,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            border: `2px solid ${theme.palette.primary.contrastText}40`,
          }}
        >
          {!avatarUrl && <PersonIcon fontSize="small" />}
          {!avatarUrl && getInitials(displayName)}
        </Avatar>

        <Box sx={{ overflow: "hidden", minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
              lineHeight: 1.2,
              color: "inherit",
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              fontSize: "0.75rem",
              opacity: 0.9,
              color: "inherit",
              letterSpacing: "0.02em",
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>

      {/* Menú del perfil */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              boxShadow: theme.shadows[8],
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;