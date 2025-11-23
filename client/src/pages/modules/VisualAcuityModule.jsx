import React from "react";
import { Box, Typography } from "@mui/material";
import { EncountersVATable } from "@/features/encounters/index_legacy";

const MemoEncountersVATable = React.memo(EncountersVATable);

function VisualAcuityModule({ encounterId }) {
  if (!encounterId) {
    return <Typography>Please select an encounter first.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Visual Acuity</Typography>
      <MemoEncountersVATable encounterId={encounterId} />
    </Box>
  );
}

export default VisualAcuityModule;