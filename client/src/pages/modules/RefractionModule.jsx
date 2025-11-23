import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { ManifestRefraction, Refraction } from "@/features/encounters/index_legacy";

const MemoManifestRefraction = React.memo(ManifestRefraction);
const MemoRefraction = React.memo(Refraction);

function RefractionModule({ encounterId }) {
  if (!encounterId) {
    return <Typography>Please select an encounter first.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Refraction</Typography>
      <Stack spacing={3}>
        <MemoRefraction encounterId={encounterId} />
        <MemoManifestRefraction encounterId={encounterId} />
      </Stack>
    </Box>
  );
}

export default RefractionModule;