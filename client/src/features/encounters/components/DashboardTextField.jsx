// src/components/DashboardTextField.jsx
import React from "react";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function DashboardTextField({ small, pd, ...rest }) {
  const theme = useTheme();

  // Base compact styling (font, padding, helper, label)
  const baseSx = {
    "& .MuiInputBase-input": {
      fontSize: theme.typography.form.input.fontSize,   // 0.65rem
      padding: theme.typography.form.input.padding,     // 3px 5px
      textAlign: "center",
      lineHeight: 1.1,
    },
    "& .MuiInputLabel-root": {
      fontSize: theme.typography.form.label.fontSize,   // 0.7rem
    },
    "& .MuiFormHelperText-root": {
      fontSize: theme.typography.form.helper.fontSize, // 0.6rem
      marginTop: "1px",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.default,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.light },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
  };

  // Width depends on `small` and whether it is a PD field
  const width = pd ? (small ? "65px" : "75px") : (small ? "55px" : "65px");

  return (
    <TextField
      {...rest}                     // <-- only the *real* TextField props
      size="small"
      variant="outlined"
      sx={{
        width,
        ...baseSx,
        // PD field gets the green background
        ...(pd && {
          "& .MuiOutlinedInput-root": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.success.dark
                : theme.palette.success.light,
            "& fieldset": { borderColor: theme.palette.success.main },
          },
        }),
        ...rest.sx,                  // allow caller to override
      }}
    />
  );
}