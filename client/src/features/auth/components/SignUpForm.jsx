
// client/src/components/landing/SignUpForm.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";

export const SignUpForm = ({ onSubmit, isLoading, onToggle }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Crear Cuenta
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} required />
        <TextField label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} required />
        <TextField label="Usuario" name="userName" value={form.userName} onChange={handleChange} required />
        <TextField label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        <TextField label="Contraseña" type="password" name="password" value={form.password} onChange={handleChange} required />

        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Registrarse"}
        </Button>
      </Box>

      <Button variant="text" onClick={onToggle} sx={{ mt: 2 }}>
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Paper>
  );
};