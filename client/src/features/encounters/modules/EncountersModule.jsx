// src/pages/modules/EncountersModule.jsx - MOBILE RESPONSIVE
import React from "react";
import { Box, Typography, Alert } from "@mui/material";
//import { EncounterTable } from "@/features/encounters/index_legacy";
import { EncounterTable } from "@/features/encounters";

const MemoEncounterTable = React.memo(EncounterTable);

function EncountersModule({ patientId, onSelectEncounter, isMobile = false }) {
  if (!patientId) {
    return (
      <Alert severity="warning">
        No patient selected. Please select a patient first.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Select Encounter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, display: isMobile ? 'none' : 'block' }}>
        Choose an encounter to begin clinical work.
      </Typography>
      
      <Box sx={{ 
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        <MemoEncounterTable
          patientId={patientId}
          onSelectEncounter={onSelectEncounter}
          compact={isMobile}
        />
      </Box>
    </Box>
  );
}

export default EncountersModule;