// src/pages/EncounterDashboard.jsx - FIXED VERSION
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Breadcrumbs,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from "@mui/material";
import { ArrowBack, Menu } from "@mui/icons-material";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";
import { MODULE_CONFIG } from "@/features/encounters/config/moduleConfig";

// Import module components
import OverviewModule from "./modules/OverviewModule";
import EncountersModule from "./modules/EncountersModule";
import VisualAcuityModule from "./modules/VisualAcuityModule";
import RefractionModule from "./modules/RefractionModule";

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
      setActiveModule('overview');
    }
  };

  // Render current module
  const renderModule = () => {
    const requiresEncounter = ['visualAcuity', 'refraction', 'exams', 'notes', 'orders'].includes(activeModule);
    
    if (requiresEncounter && !selectedEncounterId) {
      return (
        <Box sx={{ textAlign: 'center', p: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom color="text.secondary">
            Select an Encounter First
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            To access {MODULE_CONFIG[activeModule]?.title}, please select an encounter.
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
      case 'overview':
        return (
          <OverviewModule 
            encounterId={selectedEncounterId} 
            onModuleChange={handleModuleClick}
            isMobile={isMobile}
          />
        );
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
          <OverviewModule 
            encounterId={selectedEncounterId} 
            onModuleChange={handleModuleClick}
            isMobile={isMobile}
          />
        );
    }
  };

  // Sidebar content component - FIXED: Use handleModuleClick directly
  const sidebarContent = (
    <Box sx={{ p: isMobile ? 1 : 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ display: isMobile ? 'none' : 'block' }}>
        Clinical Tools
      </Typography>
      
      {/* Mobile header for sidebar */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setMobileSidebarOpen(false)} size="small">
            <ArrowBack />
          </IconButton>
        </Box>
      )}
      
      <Stack spacing={1}>
        {Object.entries(MODULE_CONFIG).map(([key, module]) => {
          const isDisabled = key !== 'overview' && key !== 'encounters' && !selectedEncounterId;
          
          return (
            <Chip
              key={key}
              label={module.title}
              icon={<span>{module.icon}</span>}
              onClick={() => handleModuleClick(key)} // FIXED: Use handleModuleClick directly
              color={activeModule === key ? "primary" : "default"}
              variant={activeModule === key ? "filled" : "outlined"}
              disabled={isDisabled}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                justifyContent: 'flex-start',
                opacity: isDisabled ? 0.5 : 1,
                width: '100%',
                '&:hover': {
                  opacity: isDisabled ? 0.5 : 0.8,
                }
              }}
            />
          );
        })}
      </Stack>

      {/* Debug buttons - FIXED: Use handleModuleClick directly */}
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>Quick Access:</Typography>
        <Stack spacing={1}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleModuleClick('encounters')} // FIXED
            fullWidth
          >
            Encounters
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleModuleClick('visualAcuity')} // FIXED
            disabled={!selectedEncounterId}
            fullWidth
          >
            Visual Acuity
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleModuleClick('refraction')} // FIXED
            disabled={!selectedEncounterId}
            fullWidth
          >
            Refraction
          </Button>
        </Stack>
      </Box>
    </Box>
  );

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
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" noWrap>
                {currentPatient.firstName} {currentPatient.lastName}
              </Typography>
              <Typography variant="caption" noWrap>
                {currentModuleConfig.title}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton 
              onClick={() => handleModuleClick('overview')} 
              size="small"
              disabled={activeModule === 'overview'}
            >
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
      )}
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
            {sidebarContent}
          </Box>
        )}

        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280 
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}
        
        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          p: isMobile ? 1 : 2, 
          overflow: 'auto',
          backgroundColor: isMobile ? '#f5f5f5' : 'transparent'
        }}>
          {renderModule()}
        </Box>
      </Box>
    </Box>
  );
}

export default EncounterDashboard;