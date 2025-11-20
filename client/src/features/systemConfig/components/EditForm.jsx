import React, { useState } from "react";
import { Button, TextField, FormControl } from "@mui/material";

export default function ConfigForm({ mode = "add", initialValue = "", onSubmit, existingValues = [], onCancel }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim().toUpperCase();

    if (!trimmed) {
      setError("El campo no puede estar vacío");
      return;
    }

    const exists = existingValues.some(
      (item) => item.toUpperCase() === trimmed
    );

    if (exists) {
      setError("⚠️ Ese valor ya existe");
      return;
    }

    setError("");
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      <FormControl sx={{ flexGrow: 1 }}>
        <TextField
          label={mode === "edit" ? "Editar Campo" : "Nuevo Campo"}
          variant="outlined"
          size="small"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(""); // clear error while typing
          }}
          error={!!error}
          helperText={error}
          slotProps={{
            input: {
              style: { textTransform: "uppercase" },
            },
          }}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {mode === "edit" ? "Guardar" : "Añadir"}
      </Button>
      {mode === "edit" && (
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancelar
        </Button>
      )}
    </form>
  );
}
