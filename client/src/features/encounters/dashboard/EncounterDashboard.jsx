// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  usePatientStore,
  useEncountersStore,
} from "@/state/zustand/ZustandStore";

import EncounterLayout from "@/features/encounters/layout/EncounterLayout";
import AccordionModules from "@/features/encounters/modules/AccordionModules";
import EncounterSidebar from "@/features/encounters/layout/EncounterSidebar";

function EncounterDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;

  const initPatientState = useEncountersStore((s) => s.initPatientState);

  const selectedEncounterId = useEncountersStore((s) => {
    if (!patientId) return null;
    const patientState = s.encountersByPatient[patientId];
    const id = patientState?.selectedEncounterId;
    return id != null ? String(id) : null;
  });

  /* Initialize patient encounter state only */
  useEffect(() => {
    if (patientId) {
      console.log("Initializing patient state for:", patientId);
      initPatientState(patientId);
    }
  }, [patientId, initPatientState]);

  if (!currentPatient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No patient selected.</Typography>
      </Box>
    );
  }

  return (
    <EncounterLayout
      isMobile={isMobile}
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
      SidebarComponent={<EncounterSidebar />}
    >
      <AccordionModules
        encounterId={selectedEncounterId}
        patientId={patientId}     
        isMobile={isMobile}
      />
    </EncounterLayout>
  );
}

export default React.memo(EncounterDashboard);