import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function PatientTab3({ values, errors, onChange, readOnly = false }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          label="Blood Type"
          name="bloodType"
          value={values.bloodType || ""}
          onChange={onChange}
          error={!!errors.bloodType}
          helperText={errors.bloodType}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Marital Status"
          name="marital"
          value={values.marital || ""}
          onChange={onChange}
          error={!!errors.marital}
          helperText={errors.marital}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Occupation"
          name="occupation"
          value={values.occupation || ""}
          onChange={onChange}
          error={!!errors.occupation}
          helperText={errors.occupation}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Religion"
          name="religion"
          value={values.religion || ""}
          onChange={onChange}
          error={!!errors.religion}
          helperText={errors.religion}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Referral"
          name="referral"
          value={values.referral || ""}
          onChange={onChange}
          error={!!errors.referral}
          helperText={errors.referral}
          fullWidth
          disabled={readOnly}
        />
      </Grid>
    </Grid>
  );
}
