// src/pages/EncounterDashboard.jsx - DESKTOP SIMPLIFIED
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Drawer,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useEncountersStore } from "@/state/zustand/ZustandStore";
import { MODULE_CONFIG } from "@/features/encounters/config/moduleConfig";

// Import module components
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
      // After selecting encounter, stay in encounters module or go to first clinical tool
      setActiveModule('visualAcuity'); // Or keep it on encounters if you prefer
    }
  };

  // Render current module - REMOVED OVERVIEW
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

  // Sidebar content component - SIMPLIFIED
  const sidebarContent = (
    <Box sx={{ p: isMobile ? 1 : 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Clinical Tools
      </Typography>
      
      {/* Mobile header for sidebar */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setMobileSidebarOpen(false)} size="small">
            <Menu />
          </IconButton>
        </Box>
      )}
      
      <Stack spacing={1}>
        {Object.entries(MODULE_CONFIG).map(([key, module]) => {
          // Remove overview from available modules
          if (key === 'overview') return null;
          
          const isDisabled = key !== 'encounters' && !selectedEncounterId;
          
          return (
            <Chip
              key={key}
              label={module.title}
              icon={<span>{module.icon}</span>}
              onClick={() => handleModuleClick(key)}
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile App Bar Only */}
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
            <Typography variant="h6" noWrap>
              {MODULE_CONFIG[activeModule]?.title}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar - ALWAYS VISIBLE */}
        {!isMobile && (
          <Box sx={{ 
            width: 250, 
            borderRight: 1, 
            borderColor: 'divider', 
            overflow: 'auto',
            backgroundColor: 'grey.50'
          }}>
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
          p: isMobile ? 1 : 3, 
          overflow: 'auto',
        }}>
          {renderModule()}
        </Box>
      </Box>
    </Box>
  );
}

export default EncounterDashboard;