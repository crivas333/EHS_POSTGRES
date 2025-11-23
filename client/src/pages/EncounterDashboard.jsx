// src/pages/EncounterDashboard.jsx - COMPLETE UPDATED VERSION
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Breadcrumbs,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";
import { MODULE_CONFIG } from "@/features/encounters/config/moduleConfig";

// Import module components
import OverviewModule from "./modules/OverviewModule";
import EncountersModule from "./modules/EncountersModule";
import VisualAcuityModule from "./modules/VisualAcuityModule";
import RefractionModule from "./modules/RefractionModule";

// Use React state instead of Zustand for module management
function EncounterDashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  
  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id;
  
  const selectedEncounterId = useEncountersStore((s) => {
    if (!patientId) return null;
    const patientState = s.encountersByPatient[patientId];
    return patientState?.selectedEncounterId ?? null;
  });

  console.log('EncounterDashboard - activeModule:', activeModule);
  console.log('EncounterDashboard - patientId:', patientId);
  console.log('EncounterDashboard - selectedEncounterId:', selectedEncounterId);

  const handleModuleClick = (moduleKey) => {
    console.log('Changing module to:', moduleKey);
    setActiveModule(moduleKey);
  };

  const handleSelectEncounter = (encounter) => {
    console.log('EncounterDashboard - Selected encounter:', encounter);
    if (encounter && patientId) {
      const { setSelectedEncounterId } = useEncountersStore.getState();
      setSelectedEncounterId(patientId, encounter.id);
      console.log('EncounterDashboard - Set encounter ID:', encounter.id);
      setActiveModule('overview');
    }
  };

  // Render current module
  const renderModule = () => {
    const requiresEncounter = ['visualAcuity', 'refraction', 'exams', 'notes', 'orders'].includes(activeModule);
    
    if (requiresEncounter && !selectedEncounterId) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom color="text.secondary">
            Select an Encounter First
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            To access {MODULE_CONFIG[activeModule]?.title}, please select an encounter.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setActiveModule('encounters')}
          >
            Select Encounter
          </Button>
        </Box>
      );
    }

    switch (activeModule) {
      case 'overview':
        return (
          <OverviewModule 
            encounterId={selectedEncounterId} 
          
            onModuleChange={setActiveModule} 
          />
        );
      case 'encounters':
        return (
          <EncountersModule 
            patientId={patientId} 
            onSelectEncounter={handleSelectEncounter} 
          />
        );
      case 'visualAcuity':
        return <VisualAcuityModule encounterId={selectedEncounterId} />;
      case 'refraction':
        return <RefractionModule encounterId={selectedEncounterId} />;
      case 'exams':
        return <Typography variant="h4">Exams Module - Coming Soon</Typography>;
      case 'notes':
        return <Typography variant="h4">Clinical Notes Module - Coming Soon</Typography>;
      case 'orders':
        return <Typography variant="h4">Orders Module - Coming Soon</Typography>;
      default:
        return (
          <OverviewModule 
            encounterId={selectedEncounterId} 
           //atientId={patientId} 
            onModuleChange={setActiveModule} 
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

  const currentModuleConfig = MODULE_CONFIG[activeModule];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => setActiveModule('overview')} size="small">
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {currentPatient.firstName} {currentPatient.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DOB: {currentPatient.dateOfBirth} • MRN: {currentPatient.mrn}
            </Typography>
          </Box>
          
          <Chip 
            label={currentModuleConfig.title} 
            icon={<span>{currentModuleConfig.icon}</span>}
            variant="outlined"
          />
        </Stack>
        
        <Breadcrumbs sx={{ mt: 1 }}>
          <Chip label="Patient Chart" size="small" variant="outlined" />
          <Chip label={currentModuleConfig.title} size="small" variant="filled" />
        </Breadcrumbs>
      </Box>
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2 }}>
          <Typography variant="h6" gutterBottom>Clinical Tools</Typography>
          
          {/* Debug info */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" display="block">
              Current: {activeModule}
            </Typography>
            <Typography variant="caption" display="block">
              Encounter: {selectedEncounterId ? 'Selected' : 'None'}
            </Typography>
            <Typography variant="caption" display="block">
              Patient ID: {patientId}
            </Typography>
          </Box>
          
          <Stack spacing={1}>
            {Object.entries(MODULE_CONFIG).map(([key, module]) => {
              const isDisabled = key !== 'overview' && !selectedEncounterId;
              
              return (
                <Chip
                  key={key}
                  label={module.title}
                  icon={<span>{module.icon}</span>}
                  onClick={() => {
                    console.log(`Clicked ${key} module`);
                    handleModuleClick(key);
                  }}
                  color={activeModule === key ? "primary" : "default"}
                  variant={activeModule === key ? "filled" : "outlined"}
                  disabled={isDisabled}
                  sx={{ 
                    justifyContent: 'flex-start',
                    opacity: isDisabled ? 0.5 : 1,
                    '&:hover': {
                      opacity: isDisabled ? 0.5 : 0.8,
                    }
                  }}
                />
              );
            })}
          </Stack>
          
          {/* Debug buttons */}
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>Debug Buttons:</Typography>
            <Stack spacing={1}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleModuleClick('encounters')}
              >
                Force: Encounters
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleModuleClick('visualAcuity')}
                disabled={!selectedEncounterId}
              >
                Force: Visual Acuity
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleModuleClick('refraction')}
                disabled={!selectedEncounterId}
              >
                Force: Refraction
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => console.log('Current state:', { activeModule, selectedEncounterId, patientId })}
              >
                Log State
              </Button>
            </Stack>
          </Box>
        </Box>
        
        {/* Main Content */}
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          {renderModule()}
        </Box>
      </Box>
    </Box>
  );
}

export default EncounterDashboard;