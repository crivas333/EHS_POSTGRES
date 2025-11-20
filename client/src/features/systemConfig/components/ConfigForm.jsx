import React, { useState, useEffect } from "react";
import { FormControl, TextField, Button, Stack } from "@mui/material";

export default function ConfigForm({
  mode = "add",
  initialValue = "",
  existingValues = [],
  onSubmit,
  onCancel,
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(initialValue);
    setError("");
  }, [initialValue]);

  // Validate as user types
  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue(val);

    if (!val.trim()) {
      setError("El valor no puede estar vacío");
      return;
    }

    if (existingValues.includes(val) && (mode === "add" || val !== initialValue)) {
      setError("⚠️ Ese valor ya existe");
      return;
    }

    setError(""); // valid input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = value.trim().toUpperCase();

    if (!val) {
      setError("El valor no puede estar vacío");
      return;
    }

    if (existingValues.includes(val) && (mode === "add" || val !== initialValue)) {
      setError("⚠️ Ese valor ya existe");
      return;
    }

    onSubmit(val);
    setValue(""); // reset only in add mode
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ flexGrow: 1 }}>
          <TextField
            label={mode === "edit" ? "Editar Campo" : "Nuevo Campo"}
            variant="outlined"
            size="small"
            autoComplete="off"
            value={value}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            sx={{ "& input": { textTransform: "uppercase" } }}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!!error || !value.trim()} // ❌ disabled when error or empty
        >
          {mode === "edit" ? "Guardar" : "Añadir"}
        </Button>

        {mode === "edit" && (
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Stack>
    </form>
  );
}
