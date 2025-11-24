
import React, { useMemo } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { EncounterTable } from "@/features/encounters";
import { SectionHeader } from "./SectionHeader";

const MemoTable = React.memo(EncounterTable);

export default function EncountersModule({ patientId, onSelectEncounter, isMobile }) {

  // ❗ Always run hooks unconditionally
  const tableProps = useMemo(
    () => ({ patientId, onSelectEncounter, compact: isMobile }),
    [patientId, onSelectEncounter, isMobile]
  );

  // ❗ Now we can return early AFTER hooks
  if (!patientId) {
    return <Alert severity="warning">No patient selected. Please select a patient first.</Alert>;
  }

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <SectionHeader title="Select Encounter" isMobile={isMobile} />

      {!isMobile && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Choose an encounter to begin clinical work.
        </Typography>
      )}

      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <MemoTable {...tableProps} />
      </Box>
    </Box>
  );
}
