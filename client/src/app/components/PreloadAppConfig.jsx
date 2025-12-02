// src/app/components/PreloadAppConfig.jsx
import React from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useApplicationFields } from "@/features/system-config/hooks/useApplicationFields"

export default function PreloadAppConfig({ children }) {
  const { isLoading, isError, error, refetch } = useApplicationFields();
  // ↑ Eliminamos 'data' porque no lo necesitamos aquí

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 3,
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={80} thickness={5} />
        <Typography variant="h5" color="text.secondary">
          Cargando configuración del sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esto solo toma un momento...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error al cargar la configuración
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
          {error?.message || "No se pudo conectar con el servidor."}
        </Typography>
        <Button variant="contained" size="large" onClick={refetch}>
          Reintentar
        </Button>
      </Box>
    );
  }

  // ¡Todo listo! → renderizamos el resto de la app
  return <>{children}</>;
}