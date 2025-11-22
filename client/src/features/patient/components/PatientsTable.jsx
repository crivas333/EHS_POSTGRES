// src/features/patient/components/PatientsTable.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

// CONFIGURACIÓN FIJA
const ROW_HEIGHT = 53;
const VISIBLE_ROWS = 12;
const TABLE_HEIGHT = VISIBLE_ROWS * ROW_HEIGHT + 64; // header + padding

const SkeletonRow = () => (
  <TableRow>
    <TableCell><Skeleton variant="text" width="70%" /></TableCell>
    <TableCell><Skeleton variant="text" width="85%" /></TableCell>
    <TableCell><Skeleton variant="text" width="75%" /></TableCell>
    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
  </TableRow>
);

export default function PatientsTable({
  data = [],
  pageCount = 0,
  pagination,
  setPagination,
  isLoading = false,
  onRowClick,
}) {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      columnHelper.accessor("idTypeNo", {
        header: "Nº Documento",
        cell: (info) => (
          <Typography fontFamily="monospace" fontWeight="bold" color="primary">
            {info.getValue() || "-"}
          </Typography>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Nombre Completo",
        cell: (info) => <Typography fontWeight="medium">{info.getValue()}</Typography>,
      }),
      columnHelper.accessor(
        (row) => `${row.lastName || ""} ${row.lastName2 || ""}`.trim(),
        {
          id: "apellidos",
          header: "Apellidos",
          cell: (info) => <Typography color="text.secondary">{info.getValue() || "-"}</Typography>,
        }
      ),
      columnHelper.display({
        id: "actions",
        header: "Acción",
        cell: ({ row }) => (
          <Box
            component="button"
            sx={{
              background: "none",
              border: "none",
              color: theme.palette.primary.main,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: theme.palette.primary.dark },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row.original);
            }}
          >
            Abrir ficha →
          </Box>
        ),
      }),
    ],
    [onRowClick, theme]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: !isLoading,
  });

  // Siempre renderizamos VISIBLE_ROWS filas
  const renderFixedRows = () => {
    const rows = [];

    if (isLoading) {
      for (let i = 0; i < VISIBLE_ROWS; i++) {
        rows.push(<SkeletonRow key={`load-${i}`} />);
      }
    } else if (data.length === 0) {
      rows.push(
        <TableRow key="no-results">
          <TableCell colSpan={4} align="center" sx={{ height: ROW_HEIGHT * 4 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron pacientes
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Intenta con otros criterios de búsqueda
            </Typography>
          </TableCell>
        </TableRow>
      );
      for (let i = 1; i < VISIBLE_ROWS; i++) {
        rows.push(
          <TableRow key={`empty-${i}`} sx={{ height: ROW_HEIGHT }}>
            <TableCell colSpan={4} sx={{ borderBottom: "none" }} />
          </TableRow>
        );
      }
    } else {
      table.getRowModel().rows.forEach((row) => {
        rows.push(
          <TableRow
            key={row.id}
            hover
            onClick={() => onRowClick(row.original)}
            sx={{
              cursor: "pointer",
              height: ROW_HEIGHT,
              "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} sx={{ py: 2 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      });

      const remaining = VISIBLE_ROWS - table.getRowModel().rows.length;
      for (let i = 0; i < remaining; i++) {
        rows.push(
          <TableRow key={`fill-${i}`} sx={{ height: ROW_HEIGHT }}>
            <TableCell colSpan={4} sx={{ borderBottom: "none" }} />
          </TableRow>
        );
      }
    }

    return rows;
  };

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
      {/* ALTURA TOTAL FIJA */}
      <TableContainer sx={{ height: TABLE_HEIGHT }}>
        <Table stickyHeader size="medium">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                      cursor: isLoading ? "default" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {!isLoading && (header.column.getIsSorted() === "asc" ? "↑" : header.column.getIsSorted() === "desc" ? "↓" : null)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>{renderFixedRows()}</TableBody>
        </Table>
      </TableContainer>

      {/* LÍNEA CORREGIDA: sin ?? + && */}
      <TablePagination
        component="div"
        count={pageCount > 0 ? pageCount * pagination.pageSize : -1}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, newPage) => setPagination((p) => ({ ...p, pageIndex: newPage }))}
        onRowsPerPageChange={(e) =>
          setPagination({ pageIndex: 0, pageSize: parseInt(e.target.value, 10) })
        }
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
}

PatientsTable.propTypes = {
  data: PropTypes.array.isRequired,
  pageCount: PropTypes.number.isRequired,
  pagination: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func.isRequired,
};