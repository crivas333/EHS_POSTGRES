import React, { useEffect, useMemo, useRef, useCallback } from "react";
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
import { shallow } from "zustand/shallow";

export default function EncounterTable({ patientId, selectedEncounterId }) {
  /* ---------------------------------------------------------------------------
     1. Zustand UI State (Sorting, Pagination, Selection)
     --------------------------------------------------------------------------- */
  const initPatientState = useEncountersStore((s) => s.initPatientState);
  const setSelectedEncounterId = useEncountersStore((s) => s.setSelectedEncounterId);

  const rawPagination = useEncountersStore(
    (s) => s.getPagination(patientId),
    shallow
  );

  const rawSorting = useEncountersStore(
    (s) => s.getSorting(patientId),
    shallow
  );

  const pagination = useMemo(
    () => rawPagination ?? { page: 0, rowsPerPage: 10 },
    [rawPagination]
  );

  const sorting = useMemo(
    () => rawSorting ?? { orderBy: "start", order: "desc" },
    [rawSorting]
  );

  const { page, rowsPerPage } = pagination;
  const { order, orderBy } = sorting;

  useEffect(() => {
    if (patientId) initPatientState(patientId);
  }, [patientId, initPatientState]);

  /* ---------------------------------------------------------------------------
     2. React Query data (NO Zustand caching)
     --------------------------------------------------------------------------- */
  const {
    data: encounters = [],
    isLoading: apiLoading,
    isError,
    error,
  } = useEncounters(patientId);

  const showLoading = apiLoading;

  /* ---------------------------------------------------------------------------
     3. Sorting
     --------------------------------------------------------------------------- */
  const sortedData = useMemo(() => {
    const arr = [...encounters];
    arr.sort((a, b) => {
      const A = a[orderBy];
      const B = b[orderBy];
      if (A == null) return 1;
      if (B == null) return -1;
      return order === "asc" ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
    return arr;
  }, [encounters, order, orderBy]);

  /* ---------------------------------------------------------------------------
     4. Pagination
     --------------------------------------------------------------------------- */
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  /* ---------------------------------------------------------------------------
     5. Scroll selected row into view
     --------------------------------------------------------------------------- */
  const rowRefs = useRef({});

  useEffect(() => {
    const el = selectedEncounterId && rowRefs.current[selectedEncounterId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedEncounterId]);

  /* ---------------------------------------------------------------------------
     6. Handlers
     --------------------------------------------------------------------------- */
  const handleSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === "asc";
      useEncountersStore.getState().setSorting(patientId, {
        orderBy: property,
        order: isAsc ? "desc" : "asc",
      });
    },
    [order, orderBy, patientId]
  );

  const handlePageChange = useCallback(
    (_, newPage) => {
      useEncountersStore
        .getState()
        .setPagination(patientId, { ...pagination, page: newPage });
    },
    [patientId, pagination]
  );

  const handleRowsPerPageChange = useCallback(
    (e) => {
      useEncountersStore.getState().setPagination(patientId, {
        page: 0,
        rowsPerPage: parseInt(e.target.value, 10),
      });
    },
    [patientId]
  );

  /* ---------------------------------------------------------------------------
     7. Render
     --------------------------------------------------------------------------- */
  return (
    <Paper sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {showLoading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" sx={{ p: 2 }}>
          Failed to load encounters: {error?.message ?? "unknown error"}
        </Typography>
      )}

      {!showLoading && !isError && (
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

                      <TableCell sortDirection={orderBy === "encounterId" ? order : false}>
                        <TableSortLabel
                          active={orderBy === "encounterId"}
                          direction={orderBy === "encounterId" ? order : "asc"}
                          onClick={() => handleSort("encounterId")}
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
                    {paginatedData.map((enc, i) => {
                      const isSelected = selectedEncounterId === Number(enc.id);

                      return (
                        <TableRow
                          key={enc.id}
                          ref={(el) => (rowRefs.current[enc.id] = el)}
                          hover
                          selected={isSelected}
                          onClick={() => setSelectedEncounterId(patientId, Number(enc.id))}
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
                          <TableCell>{page * rowsPerPage + i + 1}</TableCell>

                          <TableCell
                            sx={{
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? "primary.main" : "inherit",
                            }}
                          >
                            {enc.id}
                          </TableCell>

                          <TableCell>{enc.appointmentId ?? "—"}</TableCell>
                          <TableCell>{enc.encounterType ?? "—"}</TableCell>
                          <TableCell>{enc.consultReason ?? "—"}</TableCell>

                          <TableCell>
                            {enc.start ? new Date(enc.start).toLocaleString() : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={sortedData.length}
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