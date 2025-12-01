import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useNotificationStore } from "@/state/zustand/ZustandStore";

export default function Notifier() {
  const theme = useTheme();
  const { notification, hide } = useNotificationStore();

  const getBackgroundColor = (status) => {
    switch (status) {
      case "success":
        return theme.palette.success.main;
      case "error":
      case "fail": // alias for error
        return theme.palette.error.main;
      case "warning":
        return theme.palette.warning.main;
      case "info":
      default:
        return theme.palette.info.main;
    }
  };

  const backgroundColor = getBackgroundColor(notification.status);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={notification.open}
      autoHideDuration={4000}
      onClose={hide}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor,
        },
      }}
      message={notification.message}
      action={
        <IconButton size="small" color="inherit" onClick={hide}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

/*
Notify({ message: "Saved successfully", status: "success" });
Notify({ message: "Something went wrong", status: "error" });
Notify({ message: "Try again later", status: "fail" }); // works like error
Notify({ message: "Check your input", status: "warning" });
Notify({ message: "FYI, new update available", status: "info" });

*/