import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useSetActiveModule } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";
import { EncounterTable } from "@/features/encounters/index_legacy";

// Use React.memo to prevent unnecessary re-renders
const MemoEncounterTable = React.memo(EncounterTable);

function EncountersModule({ patientId }) {
  const setActiveModule = useSetActiveModule();
  const setSelectedEncounterId = useEncountersStore((s) => s.setSelectedEncounterId);
  
  const handleSelectEncounter = (encounter) => {
    console.log('EncountersModule - Selected encounter:', encounter);
    if (encounter && patientId) {
      // Set the selected encounter in the store
      setSelectedEncounterId(patientId, encounter.id);
      console.log('EncountersModule - Set encounter ID:', encounter.id);
      
      // Return to overview after selection
      setActiveModule('overview');
      console.log('EncountersModule - Returning to overview');
    }
  };

  if (!patientId) {
    return (
      <Alert severity="warning">
        No patient selected. Please select a patient first.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Select Encounter</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose an encounter to begin clinical work. After selection, you'll return to the overview where all clinical tools will be available.
      </Typography>
      
      <MemoEncounterTable
        patientId={patientId}
        onSelectEncounter={handleSelectEncounter}
      />
    </Box>
  );
}

export default EncountersModule;