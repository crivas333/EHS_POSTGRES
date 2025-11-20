// EncountersETTable.js
import React from "react";
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
import { useEncountersET } from "../hooks/useEncountersET";

/**
 * EncountersETTable
 * Displays refraction (SPH, CYL, AX, PD) for both eyes across 3 tests.
 */
export default function EncountersETTable({ encounterId }) {
  const { data, isLoading, isError, error } = useEncountersET(encounterId);

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
        Failed to load eye test data: {error.message}
      </Alert>
    );
  }

  const records = data?.getEncountersETByEncounterID ?? [];

  return (
    <Box>
      {records.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No eye test records found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small" aria-label="eye test table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white" }}>Eye</TableCell>
                <TableCell sx={{ color: "white" }}>SPH 1</TableCell>
                <TableCell sx={{ color: "white" }}>CYL 1</TableCell>
                <TableCell sx={{ color: "white" }}>AX 1</TableCell>
                <TableCell sx={{ color: "white" }}>PD 1</TableCell>
                <TableCell sx={{ color: "white" }}>SPH 2</TableCell>
                <TableCell sx={{ color: "white" }}>CYL 2</TableCell>
                <TableCell sx={{ color: "white" }}>AX 2</TableCell>
                <TableCell sx={{ color: "white" }}>PD 2</TableCell>
                <TableCell sx={{ color: "white" }}>SPH 3</TableCell>
                <TableCell sx={{ color: "white" }}>CYL 3</TableCell>
                <TableCell sx={{ color: "white" }}>AX 3</TableCell>
                <TableCell sx={{ color: "white" }}>PD 3</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {records.map((rec) => (
                <React.Fragment key={rec.id}>
                  {/* Right Eye (OD) */}
                  <TableRow>
                    <TableCell>OD (Right)</TableCell>
                    <TableCell>{rec.odSph1 || "—"}</TableCell>
                    <TableCell>{rec.odCyl1 || "—"}</TableCell>
                    <TableCell>{rec.odAx1 || "—"}</TableCell>
                    <TableCell>{rec.pd1 || "—"}</TableCell>
                    <TableCell>{rec.odSph2 || "—"}</TableCell>
                    <TableCell>{rec.odCyl2 || "—"}</TableCell>
                    <TableCell>{rec.odAx2 || "—"}</TableCell>
                    <TableCell>{rec.pd2 || "—"}</TableCell>
                    <TableCell>{rec.odSph3 || "—"}</TableCell>
                    <TableCell>{rec.odCyl3 || "—"}</TableCell>
                    <TableCell>{rec.odAx3 || "—"}</TableCell>
                    <TableCell>{rec.pd3 || "—"}</TableCell>
                  </TableRow>

                  {/* Left Eye (OS) */}
                  <TableRow>
                    <TableCell>OS (Left)</TableCell>
                    <TableCell>{rec.oiSph1 || "—"}</TableCell>
                    <TableCell>{rec.oiCyl1 || "—"}</TableCell>
                    <TableCell>{rec.oiAx1 || "—"}</TableCell>
                    <TableCell>{rec.pd1 || "—"}</TableCell>
                    <TableCell>{rec.oiSph2 || "—"}</TableCell>
                    <TableCell>{rec.oiCyl2 || "—"}</TableCell>
                    <TableCell>{rec.oiAx2 || "—"}</TableCell>
                    <TableCell>{rec.pd2 || "—"}</TableCell>
                    <TableCell>{rec.oiSph3 || "—"}</TableCell>
                    <TableCell>{rec.oiCyl3 || "—"}</TableCell>
                    <TableCell>{rec.oiAx3 || "—"}</TableCell>
                    <TableCell>{rec.pd3 || "—"}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
