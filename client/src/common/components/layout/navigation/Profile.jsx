// src/common/components/layout/navigation/Profile.jsx

import React from "react";
import { 
  Box, 
  Avatar, 
  Typography 
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppBarHeight } from "@/constants/layout";

const ProfileFlat = () => {
  const theme = useTheme();
  const appBarHeight = useAppBarHeight();

  // Use a placeholder or fix the path
  const user = {
    name: "Hever Mallaupoma",
    avatar: "/images/avatars/avatar_11.png", // This path is failing
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
        borderRadius: "0px",
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
    
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
