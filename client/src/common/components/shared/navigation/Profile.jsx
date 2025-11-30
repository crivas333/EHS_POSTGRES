// src/components/NavBar/ProfileFlat.jsx
import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppBarHeight } from "@/constants/layout";

const ProfileFlat = () => {
  const theme = useTheme();
  const appBarHeight = useAppBarHeight();

  const user = {
    name: "Hever Mallaupoma",
    avatar: "/images/avatars/avatar_11.png",
    bio: "Brain Director",
  };

  return (
    <Box
      sx={{
        height: appBarHeight,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderRadius: "0px !important", // ⛔ force no rounding
        boxShadow: "none !important",   // ⛔ force no shadow
        overflow: "hidden",
        // Override global Paper shape overrides:
        "--Paper-radius": "0px",
        "&, & *": {
          borderRadius: "0px !important",
        },
      }}
    >
      <Avatar
        alt={user.name}
        src={user.avatar}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%", // keep avatar circular only
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "0px !important",
        }}
      >
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" noWrap>
          {user.bio}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileFlat;
