// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  usePatientStore,
  useEncountersStore,
  useEncounterDashboardStore,
} from "@/state/zustand/ZustandStore";

import EncounterLayout from "@/features/encounters/layout/EncounterLayout";

import EncountersModule from "@/features/encounters/modules/EncountersModule";
import VisualAcuityModule from "@/features/encounters/modules/VisualAcuityModule";
import RefractionModule from "@/features/encounters/modules/RefractionModule";

function EncounterDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;

  const activeModule = useEncounterDashboardStore((s) => s.activeModule);
  const mobileSidebarOpen = useEncounterDashboardStore((s) => s.mobileSidebarOpen);

  const setActiveModule = useEncounterDashboardStore((s) => s.setActiveModule);
  const setMobileSidebarOpen = useEncounterDashboardStore(
    (s) => s.setMobileSidebarOpen
  );

  // const selectedEncounterId = useEncountersStore(
  //   (s) => s.getStateFor(patientId)?.selectedEncounterId
  // );
  const selectedEncounterId = useEncountersStore((s) => {
    if (!patientId) return null;
    const patientState = s.encountersByPatient[patientId];
    const id = patientState?.selectedEncounterId;
    return id != null ? String(id) : null; // Ensure string type
  });

  // Stable click callback - NO AUTO-NAVIGATION
  const handleModuleClick = useCallback(
    (moduleKey) => {
      setActiveModule(moduleKey);
      if (isMobile) setMobileSidebarOpen(false);
    },
    [isMobile, setActiveModule, setMobileSidebarOpen]
  );

  // Map names → component functions (NOT JSX)
  const moduleComponents = useMemo(
    () => ({
      encounters: EncountersModule,
      visualAcuity: VisualAcuityModule,
      refraction: RefractionModule,
    }),
    []
  );

  const ActiveModule = moduleComponents[activeModule];

  if (!currentPatient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          No patient selected.
        </Typography>
      </Box>
    );
  }

  return (
    <EncounterLayout
      activeModule={activeModule}
      onModuleClick={handleModuleClick}
      selectedEncounterId={selectedEncounterId}
      isMobile={isMobile}
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <ActiveModule
          patientId={patientId}
          isMobile={isMobile}
          encounterId={selectedEncounterId}
        />
      </Box>
    </EncounterLayout>
  );
}

export default React.memo(EncounterDashboard);
