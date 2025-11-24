
// src/features/encounters/modules/EncounterTable.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  memo,
  Profiler,
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
import { shallow } from "zustand/shallow";

const isDev = import.meta.env.DEV;

/* ---------------------------------------------------------------------------
   Optimized Row Component – PRE-FORMATTED DATA ONLY
--------------------------------------------------------------------------- */
const EncounterRow = memo(
  function EncounterRow({
    enc,
    rowIndex,
    isSelected,
    onSelect,
    page,
    rowsPerPage,
    rowRefs,
  }) {
    return (
      <TableRow
        ref={(el) => (rowRefs.current[enc.id] = el)}
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

        <TableCell>{enc.appointmentId}</TableCell>
        <TableCell>{enc.encounterType}</TableCell>
        <TableCell>{enc.consultReason}</TableCell>
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
   Dev-only profiling
--------------------------------------------------------------------------- */
function onRenderProfiler(id, phase, actual, base) {
  if (!isDev) return;
  if (actual > 20) {
    console.warn(
      `⚠ Slow render in <${id}>: ${actual.toFixed(1)}ms (base ${base.toFixed(
        1
      )}ms)`
    );
  }
}

/* ---------------------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------------------- */
function EncounterTable({ patientId }) {
  /* ---------------------------------------------------------------------
     1. Stable Zustand Selectors
  --------------------------------------------------------------------- */
  const initPatientState = useEncountersStore((s) => s.initPatientState);

  useEffect(() => {
    if (patientId) initPatientState(patientId);
  }, [patientId, initPatientState]);

  const FALLBACK_PAGINATION = useMemo(
    () => ({ page: 0, rowsPerPage: 10 }),
    []
  );
  const FALLBACK_SORTING = useMemo(
    () => ({ orderBy: "start", order: "desc" }),
    []
  );

  const pagination = useEncountersStore(
    (s) =>
      patientId
        ? s.getPagination(patientId) || FALLBACK_PAGINATION
        : FALLBACK_PAGINATION,
    shallow
  );

  const sorting = useEncountersStore(
    (s) =>
      patientId
        ? s.getSorting(patientId) || FALLBACK_SORTING
        : FALLBACK_SORTING,
    shallow
  );

  const selectedEncounterId = useEncountersStore(
    (s) => (patientId ? s.getSelectedEncounterId?.(patientId) : null),
    shallow
  );

  const setSelectedEncounterId = useEncountersStore(
    (s) => s.setSelectedEncounterId
  );

  const { page, rowsPerPage } = pagination;
  const { order, orderBy } = sorting;

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
     3. Pre-normalize & Pre-format data — VERY IMPORTANT
        → eliminates new Date() cost inside render
  --------------------------------------------------------------------- */
  const normalized = useMemo(() => {
    if (!encounters.length) return [];

    return encounters.map((e) => ({
      ...e,
      appointmentId: e.appointmentId ?? "—",
      encounterType: e.encounterType ?? "—",
      consultReason: e.consultReason ?? "—",
      startFormatted: e.start ? new Date(e.start).toLocaleString() : "—",
      sortValue: e[orderBy] ?? null,
    }));
  }, [encounters, orderBy]);

  /* ---------------------------------------------------------------------
     4. Sorting (super fast)
  --------------------------------------------------------------------- */
  const sortedData = useMemo(() => {
    if (normalized.length <= 1) return normalized;

    const arr = [...normalized];
    const dir = order === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      const A = a.sortValue;
      const B = b.sortValue;
      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;
      if (A > B) return dir;
      if (A < B) return -dir;
      return 0;
    });

    return arr;
  }, [normalized, order]);

  /* ---------------------------------------------------------------------
     5. Pagination
  --------------------------------------------------------------------- */
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  /* ---------------------------------------------------------------------
     6. Scroll to selected row
  --------------------------------------------------------------------- */
  const rowRefs = useRef({});

  useEffect(() => {
    if (!selectedEncounterId) return;
    const row = rowRefs.current[selectedEncounterId];
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedEncounterId]);

  /* ---------------------------------------------------------------------
     7. Handlers
  --------------------------------------------------------------------- */
  const handleSort = useCallback(
    (property) => {
      if (!patientId) return;
      const isAsc = orderBy === property && order === "asc";
      useEncountersStore
        .getState()
        .setSorting(patientId, {
          orderBy: property,
          order: isAsc ? "desc" : "asc",
        });
    },
    [orderBy, order, patientId]
  );

  const handlePageChange = useCallback(
    (_, newPage) => {
      if (!patientId) return;
      useEncountersStore.getState().setPagination(patientId, {
        ...pagination,
        page: newPage,
      });
    },
    [pagination, patientId]
  );

  const handleRowsPerPageChange = useCallback(
    (e) => {
      if (!patientId) return;
      useEncountersStore.getState().setPagination(patientId, {
        page: 0,
        rowsPerPage: parseInt(e.target.value, 10),
      });
    },
    [patientId]
  );

  const handleRowSelect = useCallback(
    (id) => {
      if (!patientId) return;
      setSelectedEncounterId(patientId, Number(id));
    },
    [patientId, setSelectedEncounterId]
  );

  /* ---------------------------------------------------------------------
     8. Render
  --------------------------------------------------------------------- */
  return (
    <Profiler id="EncounterTable" onRender={onRenderProfiler}>
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

                        <TableCell
                          sortDirection={orderBy === "id" ? order : false}
                        >
                          <TableSortLabel
                            active={orderBy === "id"}
                            direction={orderBy === "id" ? order : "asc"}
                            onClick={() => handleSort("id")}
                          >
                            Encounter ID
                          </TableSortLabel>
                        </TableCell>

                        <TableCell
                          sortDirection={
                            orderBy === "appointmentId" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "appointmentId"}
                            direction={
                              orderBy === "appointmentId" ? order : "asc"
                            }
                            onClick={() =>
                              handleSort("appointmentId")
                            }
                          >
                            Appointment ID
                          </TableSortLabel>
                        </TableCell>

                        <TableCell>Type</TableCell>
                        <TableCell>Consult Reason</TableCell>

                        <TableCell
                          sortDirection={
                            orderBy === "start" ? order : false
                          }
                        >
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
                          isSelected={
                            selectedEncounterId === Number(enc.id)
                          }
                          onSelect={handleRowSelect}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          rowRefs={rowRefs}
                        />
                      ))}
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
    </Profiler>
  );
}

export default memo(EncounterTable);
