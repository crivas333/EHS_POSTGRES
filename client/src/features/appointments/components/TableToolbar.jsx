// TableToolbar.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import AddEventDialogAppo from "./AddEventDialog";
import GlobalFilter from "./GlobalFilter";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";

import { useSearchStore } from "@/state/zustand/ZustandStore";

const TableToolbar = ({
  handleAddingEvt,
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter,
}) => {
  const searchDate = useSearchStore((state) => state.searchDate);
  const setSearchDate = useSearchStore((state) => state.setSearchDate);

  const [openDialog, setOpenDialog] = useState(false);

  const handleDateChange = (payload) => {
    const candidate = payload?.target?.value ?? payload;

    if (!candidate) {
      setSearchDate(null);
      return;
    }

    const normalized =
      candidate instanceof Date ? candidate : new Date(candidate);

    if (Number.isNaN(normalized.getTime())) {
      console.warn("Invalid date selected:", candidate);
      return;
    }

    setSearchDate(normalized);
  };

  return (
    <Toolbar
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      {/* Left: Add button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Añadir Cita
        </Button>

        {/* ✅ Add dialog inside toolbar */}
        <AddEventDialogAppo
          show={openDialog}
          closeDialog={() => setOpenDialog(false)}
          addEvent={handleAddingEvt}
        />
      </Box>

      {/* Middle: Date filter */}
      <Box sx={{ minWidth: 200 }}>
        <ReusableControls.PlainDatePicker
          name="searchDate"
          label="Fecha de Búsqueda"
          value={searchDate ?? null}
          onChange={handleDateChange}
        />
      </Box>

      {/* Right: Global filter */}
      <Box sx={{ minWidth: 250 }}>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </Box>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  handleAddingEvt: PropTypes.func, // ✅ fixed naming
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default TableToolbar;

