import React from "react";
import { Typography } from "@mui/material";

export const SectionHeader = React.memo(function SectionHeader({ title, isMobile }) {
  return (
    <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
      {title}
    </Typography>
  );
});
