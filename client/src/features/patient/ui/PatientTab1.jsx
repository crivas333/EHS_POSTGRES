import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function PatientTab1({ values, errors, onChange, readOnly = false }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="ID Type"
          name="idType"
          value={values.idType || ""}
          onChange={onChange}
          error={!!errors.idType}
          helperText={errors.idType}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="ID Number"
          name="idTypeNo"
          value={values.idTypeNo || ""}
          onChange={onChange}
          error={!!errors.idTypeNo}
          helperText={errors.idTypeNo}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="First Name"
          name="firstName"
          value={values.firstName || ""}
          onChange={onChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Last Name"
          name="lastName"
          value={values.lastName || ""}
          onChange={onChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Second Last Name"
          name="lastName2"
          value={values.lastName2 || ""}
          onChange={onChange}
          error={!!errors.lastName2}
          helperText={errors.lastName2}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Birthday"
          name="birthDay"
          type="date"
          value={values.birthDay || ""}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Sex"
          name="sex"
          value={values.sex || ""}
          onChange={onChange}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
    </Grid>
  );
}
