// src/features/appointments/TableOfAppointments.jsx
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  //alpha,
  useTheme,
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
  if (!value) return <>-</>;

  try {
    const date = new Date(value);
    return date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "Inválido";
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
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableToolbar
        handleAddingEvt={handleAddEvt}
        preGlobalFilteredRows={rows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "asc"
                        ? " up arrow"
                        : " down arrow"
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isHighlighted = row.original.id === highlightedId;
                const rowColor =
                  row.original.backgroundColor ||
                  statusToColor(row.original.status);

                return (
                  <TableRow
                    key={row.id}
                    className={isHighlighted ? "highlighted" : ""}
                    hover
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "status") {
                        return (
                          <TableCell
                            key={cell.id}
                            sx={{
                              ...theme.typography.table.statusBadge,
                              backgroundColor: rowColor,
                              color: "#fff",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell 
                          key={cell.id}
                           sx={{
                              ...theme.typography.table.cell,
                              //backgroundColor: rowColor,
                              //color: "#fff",
                            }}
                          
                          >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  No se encontraron citas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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