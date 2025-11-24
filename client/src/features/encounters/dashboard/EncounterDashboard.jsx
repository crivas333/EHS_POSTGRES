
// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore, useEncounterDashboardStore } from "@/state/zustand/ZustandStore";

import EncounterLayout from "@/features/encounters/layout/EncounterLayout";
import EncountersModule from "@/features/encounters/modules/EncountersModule";
import VisualAcuityModule from "@/features/encounters/modules/VisualAcuityModule";
import RefractionModule from "@/features/encounters/modules/RefractionModule";

const MODULES = {
  encounters: EncountersModule,
  visualAcuity: VisualAcuityModule,
  refraction: RefractionModule,
};

function EncounterDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // -----------------------------------------
  // PATIENT CONTEXT
  // -----------------------------------------
  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;

  // Initialize encounter state for patient
  useEffect(() => {
    if (patientId) {
      useEncountersStore.getState().initPatientState(patientId);
    }
  }, [patientId]);

  // -----------------------------------------
  // DASHBOARD STORE (ACTIVE MODULE + SIDEBAR)
  // -----------------------------------------
  const activeModule = useEncounterDashboardStore((s) => s.activeModule);
  const mobileSidebarOpen = useEncounterDashboardStore((s) => s.mobileSidebarOpen);

  const setActiveModule = useEncounterDashboardStore((s) => s.setActiveModule);
  const setMobileSidebarOpen = useEncounterDashboardStore((s) => s.setMobileSidebarOpen);

  // -----------------------------------------
  // SELECTED ENCOUNTER (Minimal Selector)
  // -----------------------------------------
  const selectedEncounterId = useEncountersStore(
    (s) => s.getStateFor(patientId)?.selectedEncounterId,
  );

  // -----------------------------------------
  // CALLBACKS
  // -----------------------------------------
  const handleModuleClick = useCallback(
    (moduleKey) => {
      setActiveModule(moduleKey);
      if (isMobile) setMobileSidebarOpen(false);
    },
    [isMobile, setActiveModule, setMobileSidebarOpen]
  );

  const handleSelectEncounter = useCallback(
    (encounter) => {
      if (!encounter || !patientId) return;

      // Avoid stale closures - direct state call
      useEncountersStore.getState().setSelectedEncounterId(patientId, encounter.id);

      setActiveModule("visualAcuity");
    },
    [patientId, setActiveModule]
  );

  // -----------------------------------------
  // MODULE RENDERING
  // -----------------------------------------
  const moduleContent = useMemo(() => {
    const requiresEncounter = ["visualAcuity", "refraction", "exams", "notes", "orders"].includes(
      activeModule
    );

    if (requiresEncounter && !selectedEncounterId) {
      return (
        <Box sx={{ textAlign: "center", p: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom color="text.secondary">
            Select an Encounter First
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select an encounter to access this clinical tool.
          </Typography>

          <Button variant="contained" onClick={() => handleModuleClick("encounters")}>
            Select Encounter
          </Button>
        </Box>
      );
    }

    const ModuleComponent = MODULES[activeModule];

    if (ModuleComponent) {
      return (
        <ModuleComponent
          patientId={patientId}
          encounterId={selectedEncounterId}
          onSelectEncounter={handleSelectEncounter}
          isMobile={isMobile}
        />
      );
    }

    return (
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Typography variant={isMobile ? "h5" : "h4"}>
          {activeModule.replace(/^\w/, (c) => c.toUpperCase())} Module - Coming Soon
        </Typography>
      </Box>
    );
  }, [
    activeModule,
    selectedEncounterId,
    patientId,
    isMobile,
    handleModuleClick,
    handleSelectEncounter,
  ]);

  // -----------------------------------------
  // NO PATIENT SELECTED
  // -----------------------------------------
  if (!currentPatient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          No patient selected.
        </Typography>
      </Box>
    );
  }

  // -----------------------------------------
  // FINAL RENDER
  // -----------------------------------------
  return (
    <EncounterLayout
      activeModule={activeModule}
      onModuleClick={handleModuleClick}
      selectedEncounterId={selectedEncounterId}
      isMobile={isMobile}
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
    >
      {moduleContent}
    </EncounterLayout>
  );
}

export default EncounterDashboard;
