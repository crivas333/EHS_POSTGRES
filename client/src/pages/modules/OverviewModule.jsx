import React from "react";
import { Box, Typography, Stack, Chip, Button, Alert, Card, CardContent } from "@mui/material";

function OverviewModule({ encounterId, onModuleChange }) {
  console.log('OverviewModule - encounterId:', encounterId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Patient Overview</Typography>
      
      {/* Current Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Clinical Workspace Status</Typography>
          {!encounterId ? (
            <Alert severity="info" icon={false}>
              <Typography variant="body1" gutterBottom>
                🚫 No Encounter Selected
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Most clinical tools require an encounter to be selected first.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => onModuleChange('encounters')}
                size="small"
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
                All clinical tools are now available. Encounter ID: <strong>{encounterId}</strong>
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
        <Chip 
          label="📋 Select Encounter" 
          onClick={() => onModuleChange('encounters')}
          variant={!encounterId ? "filled" : "outlined"}
          color={!encounterId ? "primary" : "default"}
        />
        <Chip 
          label="👁️ Visual Acuity" 
          onClick={() => onModuleChange('visualAcuity')}
          variant="outlined"
          disabled={!encounterId}
        />
        <Chip 
          label="🔍 Refraction" 
          onClick={() => onModuleChange('refraction')}
          variant="outlined"
          disabled={!encounterId}
        />
        <Chip 
          label="🩺 Conduct Exams" 
          onClick={() => onModuleChange('exams')}
          variant="outlined"
          disabled={!encounterId}
        />
      </Stack>

      {/* Available Modules Status */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Module Access</Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Overview</Typography>
              <Chip label="Always Available" size="small" color="success" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Encounters</Typography>
              <Chip label="Always Available" size="small" color="success" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Visual Acuity</Typography>
              <Chip 
                label={encounterId ? "Available" : "Requires Encounter"} 
                size="small" 
                color={encounterId ? "success" : "default"} 
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Refraction</Typography>
              <Chip 
                label={encounterId ? "Available" : "Requires Encounter"} 
                size="small" 
                color={encounterId ? "success" : "default"} 
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OverviewModule;