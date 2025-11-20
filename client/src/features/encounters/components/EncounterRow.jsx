import React from "react";
import { TableRow, TableCell } from "@mui/material";

export default function EncounterRow({ encounter, index }) {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": { backgroundColor: "action.hover" },
        cursor: "pointer",
      }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell>{encounter.appointmentId}</TableCell>
      <TableCell>{encounter.encounterType}</TableCell>
      <TableCell>
        {encounter.start ? new Date(encounter.start).toLocaleString() : "—"}
      </TableCell>
      <TableCell>
        {encounter.end ? new Date(encounter.end).toLocaleString() : "—"}
      </TableCell>
      <TableCell>{encounter.consultReason || "—"}</TableCell>
    </TableRow>
  );
}
