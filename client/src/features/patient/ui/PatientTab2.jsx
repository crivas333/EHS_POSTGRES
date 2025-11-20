import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function PatientTab2({ values, errors, onChange, readOnly = false }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Phone 1"
          name="phone1"
          value={values.phone1 || ""}
          onChange={onChange}
          error={!!errors.phone1}
          helperText={errors.phone1}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Phone 2"
          name="phone2"
          value={values.phone2 || ""}
          onChange={onChange}
          error={!!errors.phone2}
          helperText={errors.phone2}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          name="email"
          value={values.email || ""}
          onChange={onChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Address"
          name="address"
          value={values.address || ""}
          onChange={onChange}
          error={!!errors.address}
          helperText={errors.address}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Guardian Name"
          name="gName"
          value={values.gName || ""}
          onChange={onChange}
          error={!!errors.gName}
          helperText={errors.gName}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Guardian Phone"
          name="gPhone1"
          value={values.gPhone1 || ""}
          onChange={onChange}
          error={!!errors.gPhone1}
          helperText={errors.gPhone1}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
    </Grid>
  );
}
