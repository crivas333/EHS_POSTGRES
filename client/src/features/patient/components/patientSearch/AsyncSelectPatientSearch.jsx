
// client/src/components/patient/patientSearch/AsyncSelectPatientSearch.jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDebounce } from "use-debounce"; // ← ¡La estrella del show!

import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_PATIENT_BY_ID } from "@/features/patient/api/gqlQueries_patient";
import { usePatientSearch } from "@/features/patient/hooks/usePatientSearch";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useTheme } from "@mui/material/styles";
import { getSelectStyles } from "@/theme/selectStyles";

import "./asyncSelect.css";

// Label format helper
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// Helper: fetch full patient record by ID
async function getPatientById(id) {
  try {
    const res = await myclient.request(SEARCH_PATIENT_BY_ID, { id });
    return res?.patient ?? null;
  } catch (err) {
    console.error("getPatientById error:", err);
    return null;
  }
}

// Main component
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

  // Debounce del input (¡400ms de espera!)
  const [debouncedInput] = useDebounce(inputValue, 400);

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    clearSelect: () => {
      setSelectedValue(null);
      setInputValue("");
      setCurrentPatient(null);
    },
    refreshOptions: () => {
      setInputValue(""); // forzará nueva búsqueda al escribir
    },
  }));

  // Fetch options basado en el valor debounced
  const loadOptions = useCallback(
    async (searchQuery, loadedOptions, { page = 1 }) => {
      const trimmed = searchQuery.trim().toUpperCase();

      if (trimmed.length < 2) {
        return {
          options: [],
          hasMore: false,
        };
      }

      const results = await searchPatients(trimmed, page);

      const options = results.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        idTypeNo: p.idTypeNo,
      }));

      if (setOptions) setOptions(options);

      const hasMore = results.length === 20; // tu PAGE_SIZE

      return {
        options,
        hasMore,
        additional: { page: hasMore ? page + 1 : page },
      };
    },
    [searchPatients, setOptions]
  );

  // Memoizamos loadOptions con el valor debounced
  const memoizedLoadOptions = useMemo(() => {
    return (searchQuery, loadedOptions, additional) =>
      loadOptions(debouncedInput || searchQuery, loadedOptions, additional);
  }, [debouncedInput, loadOptions]);

  // Handle selection
  const handleChange = async (option) => {
    if (option) {
      const patient = await getPatientById(option.id);
      if (patient) setCurrentPatient(patient);
      setSelectedValue(option);

      // Auto-clear después de seleccionar (UX típico en EHRs)
      setTimeout(() => {
        setSelectedValue(null);
        setInputValue("");
      }, 300);
    } else {
      setSelectedValue(null);
      setCurrentPatient(null);
      setInputValue("");
    }
  };

  // Handle input change (mantenemos mayúsculas)
  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      setInputValue(val.toUpperCase());
    }
  };

  return (
    <AsyncPaginate
      styles={selectStyles}
      loadOptions={memoizedLoadOptions}
      debounceTimeout={400} // opcional: AsyncPaginate ya no necesita debounce externo
      value={selectedValue}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      placeholder="Busque por nombre, apellido o número de identificación"
      isClearable
      cacheOptions
      additional={{ page: 1 }}
      defaultOptions={false}
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 2
          ? "Escriba al menos 2 caracteres"
          : "No se encontraron pacientes"
      }
    />
  );
});

export default AsyncSelectPatientSearch;