
import React from "react";
import { TextField } from "@mui/material";
import { Input, FormControl, InputLabel } from '@mui/material';

export default function CustomDisplay({ name, label, value, variant = "outlined" }) {
  return (
    <TextField
      variant={variant}
      size="small"
      margin="normal"
      fullWidth
      label={label}
      name={name}
      value={value || ""}
      slotProps={{
        input: {
          readOnly: true,
          style: {
          animation: 'none',
          transition: 'none',
        }
        },
      }}
        sx={{
    '& .MuiInputLabel-root': {
      // Remove animation for label
      animationDuration: '0s !important',
      transitionDuration: '0s !important',
    },
    // Add other styles as needed
  }}
    />
  );
}
