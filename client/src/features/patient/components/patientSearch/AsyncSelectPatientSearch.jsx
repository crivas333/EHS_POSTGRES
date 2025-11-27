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

// Format how each option appears
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// Fetch a single patient record by ID
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
  { setOptions },
  ref
) {
  const theme = useTheme();
  const selectStyles = getSelectStyles(theme);

  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);
  const { searchPatients } = usePatientSearch();

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Debounce input by 400ms
  const [debouncedInput] = useDebounce(inputValue, 400);

  // Expose methods to parent
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

  /**
   * MAIN SEARCH LOADER
   */
  const loadOptions = useCallback(
    async (searchQuery, loaded, additional) => {
      const page = additional?.page ?? 1;
      const clean = (debouncedInput || searchQuery).trim().toUpperCase();

      // FIX A: enable search starting at 2 characters
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

  // Memo wrapper so AsyncPaginate gets a stable function
  const memoizedLoadOptions = useMemo(
    () => (query, loaded, additional) =>
      loadOptions(query, loaded, additional),
    [loadOptions]
  );

  /**
   * Handle selection
   */
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

    // Auto-clear after selecting (EHR common pattern)
    setTimeout(() => {
      setSelectedValue(null);
      setInputValue("");
    }, 300);
  };

  /**
   * Track input (forcing uppercase)
   */
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
      cacheOptions
      defaultOptions={false}
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
