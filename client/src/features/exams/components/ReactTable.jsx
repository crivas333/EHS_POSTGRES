// EnhancedTable.js
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
} from "@mui/material";
import TableToolbar from "./TableToolbar";
import TablePaginationActions from "./ExamTablePaginationActions";

export default function EnhancedTable({ columns, data, setData }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
  });

  const handleChangePage = (_event, newPage) => {
    table.setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    table.setPageSize(Number(event.target.value));
  };

  const addUserHandler = (user) => {
    setData([...data, user]);
  };

  const numSelected = table.getSelectedRowModel().rows.length;

  return (
    <TableContainer component={Paper}>
      <TableToolbar
        numSelected={numSelected}
        addUserHandler={addUserHandler}
        preGlobalFilteredRows={table.getPreFilteredRowModel().rows}
        setGlobalFilter={table.setGlobalFilter}
        globalFilter={table.getState().globalFilter}
      />

      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {/* Optional selection checkbox column */}
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  checked={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                  inputProps={{ "aria-label": "select all rows" }}
                />
              </TableCell>

              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <TableSortLabel
                      active={header.column.getIsSorted() !== false}
                      direction={
                        header.column.getIsSorted() === "desc" ? "desc" : "asc"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  inputProps={{ "aria-label": "select row" }}
                />
              </TableCell>

              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                25,
                { label: "All", value: data.length },
              ]}
              colSpan={columns.length + 1} // +1 for selection checkbox
              count={data.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
