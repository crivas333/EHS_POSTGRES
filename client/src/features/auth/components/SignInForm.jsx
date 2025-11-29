// client/src/components/landing/SignInForm.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";

export const SignInForm = ({ onSubmit, isLoading, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    onSubmit({ email, password });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? "Ingresando..." : "Iniciar Sesión"}
        </Button>
      </Box>

      <Button variant="text" onClick={onToggle} sx={{ mt: 2 }}>
        ¿No tienes cuenta? Regístrate
      </Button>
    </Paper>
  );
};
