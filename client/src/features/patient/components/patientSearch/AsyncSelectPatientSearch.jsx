// client/src/components/patient/patientSearch/AsyncSelectPatientSearch.jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";

import { AsyncPaginate } from "react-select-async-paginate";
import { useDebounce } from "use-debounce";
import { useTheme } from "@mui/material/styles";

import { SEARCH_PATIENT_BY_ID } from "@/api/graphql/patient";
import { myclient } from "@/graphqlClient/myclient";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { usePatientSearch } from "@/features/patient/hooks/usePatientSearch";
import { getSelectStyles } from "@/theme/selectStyles";

import "./asyncSelect.css";

// Display label in menu
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// Fetch a single patient by ID
async function fetchPatientById(id) {
  try {
    const res = await myclient.request(SEARCH_PATIENT_BY_ID, { id });
    return res?.patient ?? null;
  } catch (err) {
    console.error("fetchPatientById error:", err);
    return null;
  }
}

const AsyncSelectPatientSearch = forwardRef(function AsyncSelectPatientSearch(
  { setOptions, cacheUniqs },   // 👈 cacheUniqs added
  ref
) {
  const theme = useTheme();
  const selectStyles = getSelectStyles(theme);

  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);
  const { searchPatients } = usePatientSearch();

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Debounce input
  const [debouncedInput] = useDebounce(inputValue, 400);

  // Methods exposed to parent
  useImperativeHandle(ref, () => ({
    clearSelect() {
      setSelectedValue(null);
      setInputValue("");
      setCurrentPatient(null);
    },
    refreshOptions() {
      setInputValue("");
    },
  }));

  // Loader
  const loadOptions = useCallback(
    async (searchQuery, loaded, additional) => {
      const page = additional?.page ?? 1;
      const clean = (debouncedInput || searchQuery).trim().toUpperCase();

      if (clean.length < 2) {
        return {
          options: [],
          hasMore: false,
          additional: { page: 1 },
        };
      }

      const results = await searchPatients(clean, page);
      const options = results.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        idTypeNo: p.idTypeNo,
      }));

      if (setOptions) setOptions(options);

      return {
        options,
        hasMore: results.length === 20,
        additional: { page: page + 1 },
      };
    },
    [debouncedInput, searchPatients, setOptions]
  );

  const memoizedLoadOptions = useMemo(
    () => (query, loaded, additional) =>
      loadOptions(query, loaded, additional),
    [loadOptions]
  );

  // Handle selection
  const handleChange = async (option) => {
    if (!option) {
      setSelectedValue(null);
      setCurrentPatient(null);
      setInputValue("");
      return;
    }

    const patient = await fetchPatientById(option.id);
    if (patient) setCurrentPatient(patient);

    setSelectedValue(option);

    // Auto-clear after picking
    setTimeout(() => {
      setSelectedValue(null);
      setInputValue("");
    }, 300);
  };

  // Track input
  const handleInputChange = (value, { action }) => {
    if (action === "input-change") {
      setInputValue(value.toUpperCase());
    }
  };

  return (
    <AsyncPaginate
      styles={selectStyles}
      loadOptions={memoizedLoadOptions}
      value={selectedValue}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      placeholder="Busque por nombre, apellido o número de identificación"
      isClearable
      // Removed: cacheOptions
      // Removed: defaultOptions
      cacheUniqs={cacheUniqs}     // 👈 NEW: enables cache invalidation
      additional={{ page: 1 }}
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 2
          ? "Escriba al menos 2 caracteres"
          : "No se encontraron pacientes"
      }
    />
  );
});

export default AsyncSelectPatientSearch;

