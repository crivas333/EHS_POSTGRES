import React, { useMemo, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEncountersVA } from "../hooks/useEncountersVA.js";

/* ----------------------------------------------
   Memoized Row Component
------------------------------------------------*/
const EyeRow = React.memo(function EyeRow({ label, rec, eye, getColor }) {
  const prefix = eye === "right" ? "od" : "oi";
  return (
    <TableRow>
      <TableCell>{label}</TableCell>

      <TableCell sx={{ color: getColor("va", rec[`${prefix}VaSc`]) }}>
        {rec[`${prefix}VaSc`] || "—"}
      </TableCell>

      <TableCell sx={{ color: getColor("va", rec[`${prefix}VaCc`]) }}>
        {rec[`${prefix}VaCc`] || "—"}
      </TableCell>

      <TableCell sx={{ color: getColor("iop", rec[`${prefix}Iop`]) }}>
        {rec[`${prefix}Iop`] || "—"}
      </TableCell>

      <TableCell>{rec[eye === "right" ? "lens1" : "lens2"] || "—"}</TableCell>
      <TableCell>{rec[eye === "right" ? "comm1" : "comm2"] || "—"}</TableCell>
    </TableRow>
  );
});

/* ----------------------------------------------
   Main Component (Memoized)
------------------------------------------------*/
function EncountersVATable({ encounterId }) {
  const { data, isLoading, isError, error } = useEncountersVA(encounterId);

  /* ----------------------------------------
     Memoize records
  ---------------------------------------- */
  const records = useMemo(
    () => data?.getEncountersVAByEncounterID ?? [],
    [data]
  );

  /* ----------------------------------------
     Memoize text-color logic
  ---------------------------------------- */
  const getTextColor = useCallback((field, value) => {
    if (!value) return "inherit";

    if (field === "iop" && parseFloat(value) > 21) return "error.main";

    if (field === "va") {
      const match = value.match(/20[-/](\d+)/);
      if (match && parseInt(match[1]) > 40) return "orange";
    }

    return "inherit";
  }, []);

  /* ----------------------------------------
     Loading & Error UI
  ---------------------------------------- */
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load Visual Acuity data: {error.message}
      </Alert>
    );
  }

  /* ----------------------------------------
     Empty State
  ---------------------------------------- */
  if (records.length === 0) {
    return <Typography sx={{ mt: 2 }}>No Visual Acuity records found.</Typography>;
  }

  /* ----------------------------------------
     Render Table
  ---------------------------------------- */
  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small" aria-label="optometry table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white" }}>Eye</TableCell>
              <TableCell sx={{ color: "white" }}>VA (SC)</TableCell>
              <TableCell sx={{ color: "white" }}>VA (CC)</TableCell>
              <TableCell sx={{ color: "white" }}>IOP</TableCell>
              <TableCell sx={{ color: "white" }}>Lens</TableCell>
              <TableCell sx={{ color: "white" }}>Comments</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {records.map((rec) => (
              <React.Fragment key={rec.id}>
                <EyeRow
                  label="OD (Right)"
                  rec={rec}
                  eye="right"
                  getColor={getTextColor}
                />
                <EyeRow
                  label="OS (Left)"
                  rec={rec}
                  eye="left"
                  getColor={getTextColor}
                />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/* Export memoized component */
export default React.memo(EncountersVATable);
