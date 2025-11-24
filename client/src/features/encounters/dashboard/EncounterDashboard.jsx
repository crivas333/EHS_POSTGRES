// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { shallow } from "zustand/shallow";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";

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
  const [activeModule, setActiveModule] = useState("encounters");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;

  const selectedEncounterId = useEncountersStore(
    (s) => s.encountersByPatient[patientId]?.selectedEncounterId ?? null,
    shallow
  );

  // -----------------------------------------
  // Memoized callbacks
  // -----------------------------------------
  const handleModuleClick = useCallback(
    (moduleKey) => {
      setActiveModule(moduleKey);
      if (isMobile) setMobileSidebarOpen(false);
    },
    [isMobile]
  );

  const handleSelectEncounter = useCallback(
    (encounter) => {
      if (!encounter || !patientId) return;
      const { setSelectedEncounterId } = useEncountersStore.getState();
      setSelectedEncounterId(patientId, encounter.id);
      setActiveModule("visualAcuity");
    },
    [patientId]
  );

  // -----------------------------------------
  // Memoized Module Renderer
  // -----------------------------------------
  const moduleContent = useMemo(() => {
    const requiresEncounter = ["visualAcuity", "refraction", "exams", "notes", "orders"].includes(activeModule);

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

    // Use dictionary-based rendering
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

    // Fallbacks for coming-soon modules
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
  // No Patient Selected
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
