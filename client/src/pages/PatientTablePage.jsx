// src/pages/PatientTablePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { useSearchCombined } from "@/features/patient/hooks/useSearchCombined";
import PatientsTable from "@/features/patient/components/PatientsTable";
import PatientTableToolbar from "@/features/patient/components/PatientTableToolbar";

import { Box, Container } from "@mui/material";

export default function PatientTablePage() {
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [searchMode, setSearchMode] = useState("start");

  const [debLast] = useDebounce(lastName.trim(), 400);
  const [debLast2] = useDebounce(lastName2.trim(), 400);
  const [debFirst] = useDebounce(firstName.trim(), 400);

  const { patients, totalCount, isLoading, searchCombined } = useSearchCombined();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const navigate = useNavigate();

  // Reset page al cambiar filtros
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debLast, debLast2, debFirst, searchMode]);

  // ← LA CLAVE: solo buscar si hay al menos un campo con 2+ caracteres
  const hasValidSearch = debLast.length >= 2 || debLast2.length >= 2 || debFirst.length >= 2;

  useEffect(() => {
    if (!hasValidSearch) {
      // Limpiamos resultados sin llamar al backend
      searchCombined({}); // o puedes tener un reset() en el hook
      return;
    }

    searchCombined({
      lastName: debLast,
      lastName2: debLast2,
      firstName: debFirst,
      mode: searchMode,
      pageIndex: pagination.pageIndex,
    });
  }, [hasValidSearch, debLast, debLast2, debFirst, searchMode, pagination.pageIndex, searchCombined]);

  const handlePatientClick = useCallback((patient) => {
    navigate(`/patient/${patient.id}`);
  }, [navigate]);

  const handleClear = useCallback(() => {
    setLastName("");
    setLastName2("");
    setFirstName("");
    setSearchMode("start");
    setPagination({ pageIndex: 0, pageSize: 25 });
  }, []);

  const activeFilters = [debLast, debLast2, debFirst].filter(Boolean).length;

  const pageCount = totalCount > 0 
    ? Math.ceil(totalCount / pagination.pageSize) 
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PatientTableToolbar
        lastName={lastName}
        lastName2={lastName2}
        firstName={firstName}
        searchMode={searchMode}
        onLastNameChange={setLastName}
        onLastName2Change={setLastName2}
        onFirstNameChange={setFirstName}
        onSearchModeChange={setSearchMode}
        onClearAll={handleClear}
        activeFiltersCount={activeFilters}
      />

      <Box mt={3}>
        <PatientsTable
          data={patients}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading && hasValidSearch} // solo loading si hay búsqueda activa
          onRowClick={handlePatientClick}
        />
      </Box>
    </Container>
  );
}