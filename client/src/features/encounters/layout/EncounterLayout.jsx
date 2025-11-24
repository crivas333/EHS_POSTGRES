// src/features/encounters/layout/EncounterLayout.jsx
import React from "react";
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

function EncounterLayout({ 
  activeModule, 
  onModuleClick, 
  selectedEncounterId, 
  isMobile, 
  mobileSidebarOpen, 
  setMobileSidebarOpen,
  children 
}) {
  const theme = useTheme();
  // Remove unused 'mobile' variable - using 'isMobile' from props instead
  useMediaQuery(theme.breakpoints.down('md')); // This line can be removed entirely

  // Sidebar content component
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
        {[
          { key: 'encounters', title: 'Encounters', icon: '📋' },
          { key: 'visualAcuity', title: 'Visual Acuity', icon: '👁️' },
          { key: 'refraction', title: 'Refraction', icon: '🔍' },
          { key: 'exams', title: 'Exams', icon: '🩺' },
          { key: 'notes', title: 'Clinical Notes', icon: '📝' },
          { key: 'orders', title: 'Orders', icon: '💊' },
        ].map((module) => {
          const isDisabled = module.key !== 'encounters' && !selectedEncounterId;
          
          return (
            <Chip
              key={module.key}
              label={module.title}
              icon={<span>{module.icon}</span>}
              onClick={() => onModuleClick(module.key)}
              color={activeModule === module.key ? "primary" : "default"}
              variant={activeModule === module.key ? "filled" : "outlined"}
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
              {[
                { key: 'encounters', title: 'Encounters' },
                { key: 'visualAcuity', title: 'Visual Acuity' },
                { key: 'refraction', title: 'Refraction' },
                { key: 'exams', title: 'Exams' },
                { key: 'notes', title: 'Clinical Notes' },
                { key: 'orders', title: 'Orders' },
              ].find(m => m.key === activeModule)?.title || 'Clinical Tools'}
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
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default EncounterLayout;