// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

import {
  usePatientStore,
  useEncountersStore,
  useEncounterUIStore,
} from "@/state/zustand/ZustandStore";

import EncounterLayout from "@/features/encounters/layout/EncounterLayout";
import AccordionModules from "@/features/encounters/modules/AccordionModules";
import EncounterSidebar from "@/features/encounters/layout/EncounterSidebar";

function EncounterDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;

  const { mobileSidebarOpen, setMobileSidebarOpen } = useEncounterUIStore();
  const initPatientState = useEncountersStore((s) => s.initPatientState);

  const selectedEncounterId = useEncountersStore((s) => {
    const p = s.encountersByPatient[patientId];
    return p?.selectedEncounterId != null ? String(p.selectedEncounterId) : null;
  });

  useEffect(() => {
    if (patientId) initPatientState(patientId);
  }, [patientId, initPatientState]);

  if (!currentPatient)
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No patient selected.</Typography>
      </Box>
    );

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
