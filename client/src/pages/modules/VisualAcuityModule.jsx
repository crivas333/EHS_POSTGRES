// src/pages/modules/VisualAcuityModule.jsx - MOBILE RESPONSIVE
import React from "react";
import { Box, Typography } from "@mui/material";
import { EncountersVATable } from "@/features/encounters/index_legacy";

const MemoEncountersVATable = React.memo(EncountersVATable);

function VisualAcuityModule({ encounterId, isMobile = false }) {
  if (!encounterId) {
    return <Typography>Please select an encounter first.</Typography>;
  }

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Visual Acuity
      </Typography>
      <Box sx={{ 
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        <MemoEncountersVATable encounterId={encounterId} compact={isMobile} />
      </Box>
    </Box>
  );
}

export default VisualAcuityModule;