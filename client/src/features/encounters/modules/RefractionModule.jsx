import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { ManifestRefraction } from "@/features/encounters";
import { SectionHeader } from "./SectionHeader";

const MemoManifest = React.memo(ManifestRefraction);

export default function RefractionModule({ encounterId, isMobile }) {

  // ❗ Hooks must run every render
  const formProps = useMemo(
    () => ({ encounterId, compact: isMobile }),
    [encounterId, isMobile]
  );

  // ❗ Now early return is allowed
  if (!encounterId) return <Typography>Please select an encounter first.</Typography>;

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <SectionHeader title="Refraction" isMobile={isMobile} />

      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <MemoManifest {...formProps} />
      </Box>
    </Box>
  );
}
