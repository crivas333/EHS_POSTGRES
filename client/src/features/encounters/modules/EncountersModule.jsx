// src/features/encounters/modules/EncountersModule.jsx
import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { EncounterTable } from "@/features/encounters";
import { SectionHeader } from "./SectionHeader";

function EncountersModule({ patientId, isMobile }) {
  if (!patientId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No patient selected. Please select a patient first.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>

      <SectionHeader title="Select Encounter" isMobile={isMobile} />

      {!isMobile && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Choose an encounter to begin clinical work.
        </Typography>
      )}

      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <EncounterTable patientId={patientId} />
      </Box>
    </Box>
  );
}

export default React.memo(EncountersModule);
