// src/features/encounters/dashboard/EncounterDashboard.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";
import EncounterLayout from "@/features/encounters/layout/EncounterLayout";

// Import module components
import EncountersModule from "@/features/encounters/modules/EncountersModule";
import VisualAcuityModule from "@/features/encounters/modules/VisualAcuityModule";
import RefractionModule from "@/features/encounters/modules/RefractionModule";

function EncounterDashboard() {
  const [activeModule, setActiveModule] = useState('encounters');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;
  
  const selectedEncounterId = useEncountersStore((s) => {
    if (!patientId) return null;
    const patientState = s.encountersByPatient[patientId];
    return patientState?.selectedEncounterId ?? null;
  });

  const handleModuleClick = (moduleKey) => {
    console.log('Changing module to:', moduleKey);
    setActiveModule(moduleKey);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const handleSelectEncounter = (encounter) => {
    console.log('EncounterDashboard - Selected encounter:', encounter);
    if (encounter && patientId) {
      const { setSelectedEncounterId } = useEncountersStore.getState();
      setSelectedEncounterId(patientId, encounter.id);
      setActiveModule('visualAcuity');
    }
  };

  // Render current module content
  const renderModuleContent = () => {
    const requiresEncounter = ['visualAcuity', 'refraction', 'exams', 'notes', 'orders'].includes(activeModule);
    
    if (requiresEncounter && !selectedEncounterId) {
      return (
        <Box sx={{ textAlign: 'center', p: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom color="text.secondary">
            Select an Encounter First
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select an encounter to access this clinical tool.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => handleModuleClick('encounters')}
            size={isMobile ? "small" : "medium"}
          >
            Select Encounter
          </Button>
        </Box>
      );
    }

    switch (activeModule) {
      case 'encounters':
        return (
          <EncountersModule 
            patientId={patientId} 
            onSelectEncounter={handleSelectEncounter}
            isMobile={isMobile}
          />
        );
      case 'visualAcuity':
        return <VisualAcuityModule encounterId={selectedEncounterId} isMobile={isMobile} />;
      case 'refraction':
        return <RefractionModule encounterId={selectedEncounterId} isMobile={isMobile} />;
      case 'exams':
        return (
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            <Typography variant={isMobile ? "h5" : "h4"}>Exams Module - Coming Soon</Typography>
          </Box>
        );
      case 'notes':
        return (
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            <Typography variant={isMobile ? "h5" : "h4"}>Clinical Notes Module - Coming Soon</Typography>
          </Box>
        );
      case 'orders':
        return (
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            <Typography variant={isMobile ? "h5" : "h4"}>Orders Module - Coming Soon</Typography>
          </Box>
        );
      default:
        return (
          <EncountersModule 
            patientId={patientId} 
            onSelectEncounter={handleSelectEncounter}
            isMobile={isMobile}
          />
        );
    }
  };

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
      {renderModuleContent()}
    </EncounterLayout>
  );
}

export default EncounterDashboard;