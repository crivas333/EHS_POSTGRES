// src/pages/modules/RefractionModule.jsx - MOBILE RESPONSIVE
import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { ManifestRefraction, Refraction } from "@/features/encounters/index_legacy";

const MemoManifestRefraction = React.memo(ManifestRefraction);
const MemoRefraction = React.memo(Refraction);

function RefractionModule({ encounterId, isMobile = false }) {
  if (!encounterId) {
    return <Typography>Please select an encounter first.</Typography>;
  }

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Refraction
      </Typography>
      <Stack spacing={isMobile ? 2 : 3}>
       
        <Box sx={{ 
          overflow: 'auto',
          maxWidth: '100%'
        }}>
          <MemoManifestRefraction encounterId={encounterId} compact={isMobile} />
        </Box>
      </Stack>
    </Box>
  );
}

export default RefractionModule;