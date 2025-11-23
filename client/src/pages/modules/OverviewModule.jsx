// src/pages/modules/OverviewModule.jsx - MOBILE RESPONSIVE
import React from "react";
import { Box, Typography, Stack, Chip, Button, Alert, Card, CardContent } from "@mui/material";

function OverviewModule({ encounterId, onModuleChange, isMobile = false }) {
  return (
    <Box sx={{ p: isMobile ? 0 : 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ mb: 2 }}>
        Patient Overview
      </Typography>
      
      {/* Current Status Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h6" gutterBottom>Clinical Workspace Status</Typography>
          {!encounterId ? (
            <Alert severity="info" icon={false} sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                🚫 No Encounter Selected
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Most clinical tools require an encounter to be selected first.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => onModuleChange('encounters')}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                Select Encounter
              </Button>
            </Alert>
          ) : (
            <Alert severity="success" icon={false}>
              <Typography variant="body1" gutterBottom>
                ✅ Encounter Ready
              </Typography>
              <Typography variant="body2">
                All clinical tools are now available.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={1} 
        sx={{ mt: 1, mb: 3 }}
        flexWrap="wrap" 
        gap={1}
      >
        <Chip 
          label="📋 Select Encounter" 
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
          label="🩺 Conduct Exams" 
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