import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  flexRender,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";

// This is a custom filter UI for selecting a unique option from a list
function SelectColumnFilter({ column }) {
  const { getFilterValue, setFilterValue, getFacetedUniqueValues } = column;
  const facetedValues = getFacetedUniqueValues();
  const filterValue = getFilterValue();

  const options = React.useMemo(() => {
    return Array.from(facetedValues.keys());
  }, [facetedValues]);

  return (
    <select
      value={filterValue || ""}
      onChange={(e) => {
        setFilterValue(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({ column }) {
  const { getFilterValue, setFilterValue, getFacetedUniqueValues } = column;
  const facetedValues = getFacetedUniqueValues();
  const count = facetedValues.size;
  const filterValue = getFilterValue();

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilterValue(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function GlobalFilter({ table }) {
  const [value, setValue] = React.useState(table.getState().globalFilter || '');
  const [debouncedValue] = useDebounce(value, 200);

  React.useEffect(() => {
    table.setGlobalFilter(debouncedValue);
  }, [debouncedValue, table]);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={`${table.getPreFilteredRowModel().rows.length} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

export default function Table({ columns, data }) {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns: React.useMemo(() => columns, [columns]),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const firstPageRows = table.getRowModel().rows.slice(0, 10);

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {/* Render the columns filter UI */}
                  <div>
                    {header.column.getCanFilter() ? (
                      <div>
                        {header.column.columnDef.Filter ? (
                          flexRender(
                            header.column.columnDef.Filter,
                            { column: header.column }
                          )
                        ) : (
                          <DefaultColumnFilter column={header.column} />
                        )}
                      </div>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={table.getVisibleLeafColumns().length}
              style={{
                textAlign: "left",
              }}
            >
              <GlobalFilter table={table} />
            </th>
          </tr>
        </thead>
        <tbody>
          {firstPageRows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div>Showing the first 10 results of {table.getFilteredRowModel().rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(table.getState().columnFilters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}