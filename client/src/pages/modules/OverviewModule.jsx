// src/pages/modules/OverviewModule.jsx - CLEANED UP
import React from "react";
import { Box, Typography, Stack, Chip, Alert, Card, CardContent } from "@mui/material";

function OverviewModule({ encounterId, onModuleChange, isMobile = false }) {
  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ mb: 2 }}>
        Clinical Workspace
      </Typography>
      
      {/* Current Status Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h6" gutterBottom>Status</Typography>
          {!encounterId ? (
            <Alert severity="info" icon={false}>
              <Typography variant="body1" gutterBottom>
                Select an encounter to begin clinical work
              </Typography>
            </Alert>
          ) : (
            <Alert severity="success" icon={false}>
              <Typography variant="body1">
                Encounter ready - All tools available
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Clinical Tools</Typography>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={1} 
        sx={{ mt: 1 }}
        flexWrap="wrap" 
        gap={1}
      >
        <Chip 
          label="📋 Encounters" 
          onClick={() => onModuleChange('encounters')}
          variant={!encounterId ? "filled" : "outlined"}
          color={!encounterId ? "primary" : "default"}
          size={isMobile ? "small" : "medium"}
        />
        <Chip 
          label="👁️ Visual Acuity" 
          onClick={() => onModuleChange('visualAcuity')}
          variant="outlined"
          disabled={!encounterId}
          size={isMobile ? "small" : "medium"}
        />
        <Chip 
          label="🔍 Refraction" 
          onClick={() => onModuleChange('refraction')}
          variant="outlined"
          disabled={!encounterId}
          size={isMobile ? "small" : "medium"}
        />
        <Chip 
          label="🩺 Exams" 
          onClick={() => onModuleChange('exams')}
          variant="outlined"
          disabled={!encounterId}
          size={isMobile ? "small" : "medium"}
        />
      </Stack>
    </Box>
  );
}

export default OverviewModule;