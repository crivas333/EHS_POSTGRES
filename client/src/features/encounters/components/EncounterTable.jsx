// src/features/encounters/modules/EncounterTable.jsx
import React, {
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

import { useEncounters } from "../hooks/useEncounters";
import { useEncountersStore } from "@/state/zustand/ZustandStore";

/* ---------------------------------------------------------------------------
   Optimized Row Component
--------------------------------------------------------------------------- */
const EncounterRow = memo(
  function EncounterRow({
    enc,
    rowIndex,
    isSelected,
    onSelect,
    page,
    rowsPerPage,
  }) {
    return (
      <TableRow
        hover
        selected={isSelected}
        onClick={() => onSelect(enc.id)}
        sx={{
          cursor: "pointer",
          backgroundColor: isSelected ? "rgba(25,118,210,0.15)" : "inherit",
          "&:hover": {
            backgroundColor: isSelected
              ? "rgba(25,118,210,0.25)"
              : "action.hover",
          },
        }}
      >
        <TableCell>{page * rowsPerPage + rowIndex + 1}</TableCell>
        <TableCell
          sx={{
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? "primary.main" : "inherit",
          }}
        >
          {enc.id}
        </TableCell>
        <TableCell>{enc.appointmentId || "—"}</TableCell>
        <TableCell>{enc.encounterType || "—"}</TableCell>
        <TableCell>{enc.consultReason || "—"}</TableCell>
        <TableCell>{enc.startFormatted}</TableCell>
      </TableRow>
    );
  },
  (prev, next) =>
    prev.enc.id === next.enc.id &&
    prev.isSelected === next.isSelected &&
    prev.page === next.page &&
    prev.rowsPerPage === next.rowsPerPage
);

/* ---------------------------------------------------------------------------
   MAIN COMPONENT - FIXED
--------------------------------------------------------------------------- */
function EncounterTable({ patientId }) {
  /* ---------------------------------------------------------------------
     1. Zustand State - FIXED WITH DEFAULTS
  --------------------------------------------------------------------- */
  const initPatientState = useEncountersStore((s) => s.initPatientState);

  useEffect(() => {
    if (patientId) initPatientState(patientId);
  }, [patientId, initPatientState]);

  // Use individual selectors to avoid object reference issues
  const pagination = useEncountersStore((s) => 
    patientId ? s.getPagination(patientId) : { page: 0, rowsPerPage: 10 }
  );
  
  const sorting = useEncountersStore((s) => 
    patientId ? s.getSorting(patientId) : { orderBy: "start", order: "desc" }
  );
  
  const selectedEncounterId = useEncountersStore((s) => 
    patientId ? s.getStateFor(patientId)?.selectedEncounterId : null
  );
  
  const setSelectedEncounterId = useEncountersStore((s) => s.setSelectedEncounterId);

  // Provide safe defaults for destructuring
  const { page = 0, rowsPerPage = 10 } = pagination || {};
  const { order = "desc", orderBy = "start" } = sorting || {};

  /* ---------------------------------------------------------------------
     2. Fetch encounters
  --------------------------------------------------------------------- */
  const {
    data: encounters = [],
    isLoading,
    isError,
    error,
  } = useEncounters(patientId);

  /* ---------------------------------------------------------------------
     3. DATA PROCESSING - SIMPLIFIED
  --------------------------------------------------------------------- */
  const { paginatedData, totalCount } = useMemo(() => {
    if (!encounters.length) return { paginatedData: [], totalCount: 0 };

    // Process data with safe defaults
    const processed = encounters.map(e => ({
      ...e,
      appointmentId: e.appointmentId || "—",
      encounterType: e.encounterType || "—", 
      consultReason: e.consultReason || "—",
      startFormatted: e.start ? new Date(e.start).toLocaleString() : "—",
    }));

    // Simple sorting
    const sorted = [...processed].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return order === "asc" ? comparison : -comparison;
    });

    // Pagination
    const start = page * rowsPerPage;
    const paginated = sorted.slice(start, start + rowsPerPage);

    return { paginatedData: paginated, totalCount: sorted.length };
  }, [encounters, orderBy, order, page, rowsPerPage]);

  /* ---------------------------------------------------------------------
     4. Handlers - STABLE
  --------------------------------------------------------------------- */
  const handleSort = useCallback((property) => {
    if (!patientId) return;
    const isAsc = orderBy === property && order === "asc";
    useEncountersStore.getState().setSorting(patientId, {
      orderBy: property,
      order: isAsc ? "desc" : "asc",
    });
  }, [orderBy, order, patientId]);

  const handlePageChange = useCallback((_, newPage) => {
    if (!patientId) return;
    useEncountersStore.getState().setPagination(patientId, {
      page: newPage,
      rowsPerPage,
    });
  }, [patientId, rowsPerPage]);

  const handleRowsPerPageChange = useCallback((e) => {
    if (!patientId) return;
    useEncountersStore.getState().setPagination(patientId, {
      page: 0,
      rowsPerPage: parseInt(e.target.value, 10),
    });
  }, [patientId]);

  const handleRowSelect = useCallback((id) => {
    if (!patientId) return;
    setSelectedEncounterId(patientId, id);
  }, [patientId, setSelectedEncounterId]);

  /* ---------------------------------------------------------------------
     5. Render
  --------------------------------------------------------------------- */
  return (
    <Paper sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {isLoading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" sx={{ p: 2 }}>
          Failed to load encounters: {error?.message ?? "unknown error"}
        </Typography>
      )}

      {!isLoading && !isError && (
        <>
          {encounters.length === 0 ? (
            <Typography sx={{ p: 2 }}>No encounters found.</Typography>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell sortDirection={orderBy === "id" ? order : false}>
                        <TableSortLabel
                          active={orderBy === "id"}
                          direction={orderBy === "id" ? order : "asc"}
                          onClick={() => handleSort("id")}
                        >
                          Encounter ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sortDirection={orderBy === "appointmentId" ? order : false}>
                        <TableSortLabel
                          active={orderBy === "appointmentId"}
                          direction={orderBy === "appointmentId" ? order : "asc"}
                          onClick={() => handleSort("appointmentId")}
                        >
                          Appointment ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Consult Reason</TableCell>
                      <TableCell sortDirection={orderBy === "start" ? order : false}>
                        <TableSortLabel
                          active={orderBy === "start"}
                          direction={orderBy === "start" ? order : "asc"}
                          onClick={() => handleSort("start")}
                        >
                          Start
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedData.map((enc, index) => (
                      <EncounterRow
                        key={enc.id}
                        enc={enc}
                        rowIndex={index}
                        isSelected={selectedEncounterId === enc.id}
                        onSelect={handleRowSelect}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </>
      )}
    </Paper>
  );
}

export default memo(EncounterTable);