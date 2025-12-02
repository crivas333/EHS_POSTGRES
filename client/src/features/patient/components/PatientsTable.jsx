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
          <Typography
            variant="body1"
            sx={{
              fontFamily: theme.typography.table.cell.fontFamily,
              fontSize: theme.typography.table.cell.fontSize,
              fontWeight: 600, // Keep the bold for document number
              color: theme.palette.primary.main,
              //fontFamily: "monospace",
            }}
          >
            {info.getValue() || "-"}
          </Typography>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Nombre Completo",
        cell: (info) => (
          <Typography
            variant="body1"
            sx={{
              ...theme.typography.table.cell,
              fontWeight: 500, // Medium weight for names
            }}
          >
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor(
        (row) => `${row.lastName || ""} ${row.lastName2 || ""}`.trim(),
        {
          id: "apellidos",
          header: "Apellidos",
          cell: (info) => (
            <Typography
              variant="body1"
              sx={{
                ...theme.typography.table.cell,
                color: theme.palette.text.secondary,
              }}
            >
              {info.getValue() || "-"}
            </Typography>
          ),
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
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              fontFamily: theme.typography.table.cell.fontFamily,
              fontSize: theme.typography.table.cell.fontSize,
              fontWeight: 600,
              "&:hover": { color: theme.palette.primary.dark },
            }}
            onClick={() => onRowClick(row.original)}
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

  // Renderiza siempre VISIBLE_ROWS filas (skeletons, datos o vacías)
  const renderRows = () => {
    const rows = [];

    if (isLoading) {
      for (let i = 0; i < VISIBLE_ROWS; i++) {
        rows.push(<SkeletonRow key={`skeleton-${i}`} />);
      }
    } else if (data.length === 0) {
      rows.push(
        <TableRow key="no-data">
          <TableCell 
            colSpan={4} 
            align="center" 
            sx={{ 
              height: ROW_HEIGHT * 4, 
              py: 6,
              ...theme.typography.table.cell,
            }}
          >
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontSize: "1rem", fontWeight: 600 }}
            >
              No se encontraron pacientes
            </Typography>
            <Typography 
              color="text.secondary" 
              mt={1}
              sx={{ fontSize: theme.typography.table.cell.fontSize }}
            >
              Intenta con otros criterios de búsqueda
            </Typography>
          </TableCell>
        </TableRow>
      );
      // Rellenar el resto para mantener altura
      for (let i = 1; i < VISIBLE_ROWS; i++) {
        rows.push(
          <TableRow key={`empty-${i}`} sx={{ height: ROW_HEIGHT }}>
            <TableCell colSpan={4} sx={{ ...theme.typography.table.cell }} />
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
            sx={{ cursor: "pointer", height: ROW_HEIGHT }}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell 
                key={cell.id}
                sx={cell.column.id === "actions" ? {} : theme.typography.table.cell}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      });

      // Rellenar filas vacías para mantener altura fija
      const remaining = VISIBLE_ROWS - table.getRowModel().rows.length;
      for (let i = 0; i < remaining; i++) {
        rows.push(
          <TableRow key={`fill-${i}`} sx={{ height: ROW_HEIGHT }}>
            <TableCell colSpan={4} sx={{ ...theme.typography.table.cell }} />
          </TableRow>
        );
      }
    }

    return rows;
  };

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ height: TABLE_HEIGHT }}>
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={isLoading ? undefined : header.column.getToggleSortingHandler()}
                    sx={{
                      cursor: isLoading ? "default" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                      ...theme.typography.table.header,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {!isLoading &&
                      (header.column.getIsSorted() === "asc"
                        ? " ↑"
                        : header.column.getIsSorted() === "desc"
                        ? " ↓"
                        : null)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pageCount > 0 ? pageCount * pagination.pageSize : -1}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, newPage) =>
          setPagination((p) => ({ ...p, pageIndex: newPage }))
        }
        onRowsPerPageChange={(e) =>
          setPagination({
            pageIndex: 0,
            pageSize: parseInt(e.target.value, 10),
          })
        }
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
            theme.typography.table.cell,
        }}
      />
    </Paper>
  );
}

PatientsTable.propTypes = {
  data: PropTypes.array.isRequired,
  pageCount: PropTypes.number.isRequired,
  pagination: PropTypes.shape({
    pageIndex: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func.isRequired,
};