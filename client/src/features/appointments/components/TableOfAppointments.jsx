// TableOfAppointments.jsx – NIVEL HOSPITAL REAL
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

import TableToolbar from "./TableToolbar";
import EditEventDialog from "./EditEventDialog";
import DeleteEventDialog from "./DeleteEventDialog";
import { defaultEvent } from "@/features/appointments/defaultEvent";
import { statusToColor } from "@/features/appointments/statusToColor";

const columnHelper = createColumnHelper();

function TimeCell({ value }) {
  if (!value)
    return <Typography variant="body2" color="text.secondary">-</Typography>;

  try {
    const date = new Date(value);
    const formatted = date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return <Typography variant="body2">{formatted}</Typography>;
  } catch {
    return <Typography variant="body2" color="text.secondary">Inválido</Typography>;
  }
}

export default function TableOfAppointments({
  appointments,
  highlightedId,
  handleAddEvt,
  handleEditEvt,
  handleDeleteEvt,
}) {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [evt, setEvt] = useState(defaultEvent);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const rows = Array.isArray(appointments) ? appointments : [];

  const columns = useMemo(
    () => [
      columnHelper.accessor("patientId", { header: "Historia" }),
      columnHelper.accessor("fullName", { header: "Paciente" }),
      columnHelper.accessor("notRegistered", { header: "No Registrado" }),
      columnHelper.accessor("idTypeNo", { header: "Documento" }),
      columnHelper.accessor("type", { header: "Tipo" }),
      columnHelper.accessor("status", { header: "Estado" }),
      columnHelper.accessor("start", {
        header: "Inicio (Lima)",
        cell: (info) => <TimeCell value={info.getValue()} />,
      }),
      columnHelper.accessor("end", {
        header: "Fin (Lima)",
        cell: (info) => <TimeCell value={info.getValue()} />,
      }),
      columnHelper.accessor("arriveTime", {
        header: "Arrivo (Lima)",
        cell: (info) => <TimeCell value={info.getValue()} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setEvt(row.original);
                setOpenEventDialog(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setEvt(row.original);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <TableToolbar
        handleAddingEvt={handleAddEvt}
        preGlobalFilteredRows={rows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <TableContainer>
        <Table size="small" stickyHeader>
          {/* HEADER – ESTILO PROFESIONAL */}
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: theme.transitions.create("background-color"),
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          {/* BODY */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isHighlighted = row.original.id === highlightedId;
                const rowColor = row.original.backgroundColor || statusToColor(row.original.status);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      backgroundColor: isHighlighted
                        ? alpha(theme.palette.success.light, 0.3)
                        : "inherit",
                      transition: "all 0.2s ease",
                      "&:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const colId = cell.column.id;
                      let cellSx = {
                        fontSize: "0.85rem",
                        py: 1.2,
                      };

                      if (colId === "status") {
                        cellSx = {
                          ...cellSx,
                          backgroundColor: rowColor,
                          color: "#fff",
                          fontWeight: 600,
                          textAlign: "center",
                          borderRadius: 2,
                          px: 1.5,
                        };
                      }

                      return (
                        <TableCell key={cell.id} sx={cellSx}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron citas
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOGS */}
      <EditEventDialog
        show={openEventDialog}
        evt={evt}
        closeDialog={() => {
          setEvt(defaultEvent);
          setOpenEventDialog(false);
        }}
        handleChangingEvt={handleEditEvt}
      />

      <DeleteEventDialog
        show={openDeleteDialog}
        evt={evt}
        closeDialog={() => {
          setEvt(defaultEvent);
          setOpenDeleteDialog(false);
        }}
        handleRemovingEvt={handleDeleteEvt}
      />
    </Paper>
  );
}

TableOfAppointments.propTypes = {
  appointments: PropTypes.array.isRequired,
  highlightedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleAddEvt: PropTypes.func,
  handleEditEvt: PropTypes.func,
  handleDeleteEvt: PropTypes.func,
};