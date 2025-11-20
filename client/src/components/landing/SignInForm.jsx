import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export const SignInForm = ({ signIn, click }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Por favor, complete todos los campos");
      return;
    }
    setError("");
    try {
      await signIn.mutate({ variables: { email, password } });
    } catch (err) {
      console.error(err);
      setError("Error en inicio de sesión");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 8,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>

      {error && (
        <Typography color="error" variant="body2" align="center">
          {error}
        </Typography>
      )}

      <form onSubmit={submit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Iniciar Sesión
          </Button>
        </Box>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        onClick={click}
        sx={{ mt: 1 }}
      >
        Registrarse
      </Button>
    </Paper>
  );
};
