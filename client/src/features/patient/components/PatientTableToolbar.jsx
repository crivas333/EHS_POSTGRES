// src/features/patient/components/PatientTableToolbar.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Toolbar,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const PatientTableToolbar = React.memo(function PatientTableToolbar({
  lastName,
  lastName2,
  firstName,
  searchMode,              // ← nuevo: "start" | "contains"
  onLastNameChange,
  onLastName2Change,
  onFirstNameChange,
  onSearchModeChange,     // ← nuevo handler
  onClearAll,
  activeFiltersCount = 0,
}) {
  return (
    <Toolbar sx={{ backgroundColor: "grey.50", borderBottom: 1, borderColor: "divider", flexWrap: "wrap", gap: 3, py: 3 }}>
      {/* Título + contador */}
      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <Typography variant="h6" fontWeight="bold">
          Búsqueda de Pacientes
        </Typography>
        {activeFiltersCount > 0 && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo{activeFiltersCount > 1 ? "s" : ""}
          </Typography>
        )}
      </Box>

      {/* Campos de búsqueda */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
        <TextField
          label="Apellido Paterno"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="GARCÍA"
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{ style: { textTransform: "uppercase" } }}
        />

        <TextField
          label="Apellido Materno"
          value={lastName2}
          onChange={(e) => onLastName2Change(e.target.value)}
          placeholder="RODRÍGUEZ"
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{ style: { textTransform: "uppercase" } }}
        />

        <TextField
          label="Nombres"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="JUAN CARLOS"
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{ style: { textTransform: "uppercase" } }}
        />
      </Stack>

      {/* Radio buttons para modo de búsqueda */}
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={searchMode}
          onChange={(e) => onSearchModeChange(e.target.value)}
          name="search-mode"
        >
          <FormControlLabel
            value="start"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Desde el inicio</Typography>}
          />
          <FormControlLabel
            value="contains"
            control={<Radio size="small" />}
            label={<Typography variant="body2">En cualquier parte</Typography>}
          />
        </RadioGroup>
      </FormControl>

      {/* Botón limpiar */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={onClearAll}
        >
          Limpiar
        </Button>
      )}
    </Toolbar>
  );
});

PatientTableToolbar.propTypes = {
  lastName: PropTypes.string.isRequired,
  lastName2: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  searchMode: PropTypes.oneOf(["start", "contains"]).isRequired,
  onLastNameChange: PropTypes.func.isRequired,
  onLastName2Change: PropTypes.func.isRequired,
  onFirstNameChange: PropTypes.func.isRequired,
  onSearchModeChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  activeFiltersCount: PropTypes.number,
};

export default PatientTableToolbar;