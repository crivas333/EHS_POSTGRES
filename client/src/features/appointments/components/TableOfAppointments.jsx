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

// ---------- Time Cell ----------
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
    return <Typography variant="body2" color="text.secondary">Invalid</Typography>;
  }
}

const columnHelper = createColumnHelper();

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
          <div style={{ display: "flex", gap: "0.5rem" }}>
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
          </div>
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
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
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
      {/* ---------- Header ---------- */}
      <TableHead
        sx={{
          "& th": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
          },
        }}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: theme.palette.primary.main },
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted()] ?? null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>

      {/* ---------- Body ---------- */}
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
                    ? theme.palette.success.light
                    : "inherit",
                  transition: "background-color 0.3s ease",
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const colId = cell.column.id;
                  let sxCell = { fontSize: "0.85rem" };

                  // 🎨 Status cell color
                  if (colId === "status") {
                    const bgColor = rowColor;
                    sxCell = {
                      ...sxCell,
                      backgroundColor: bgColor,
                      color: "#fff",
                      borderRadius: "6px",
                      textAlign: "center",
                      fontWeight: 600,
                      px: 1.5,
                    };
                  }

                  return (
                    <TableCell key={cell.id} sx={sxCell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
              No appointments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>

  {/* ---------- Dialogs ---------- */}
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