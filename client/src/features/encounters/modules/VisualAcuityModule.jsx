
import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { EncountersVATable } from "@/features/encounters";
import { SectionHeader } from "./SectionHeader";

const MemoVA = React.memo(EncountersVATable);

export default function VisualAcuityModule({ encounterId, isMobile }) {

  // ❗ Hooks always run
  const tableProps = useMemo(
    () => ({ encounterId, compact: isMobile }),
    [encounterId, isMobile]
  );

  // ❗ Early return AFTER hooks
  if (!encounterId) return <Typography>Please select an encounter first.</Typography>;

  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <SectionHeader title="Visual Acuity" isMobile={isMobile} />

      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <MemoVA {...tableProps} />
      </Box>
    </Box>
  );
}
