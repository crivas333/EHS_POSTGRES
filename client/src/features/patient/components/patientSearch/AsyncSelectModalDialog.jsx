
// src/components/patient/patientSearch/AsyncPaginate_PatientSearch.jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDebounce } from "use-debounce"; // ← ¡La magia!

import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_PATIENT_BY_ID } from "@/features/patient/api/gqlQueries_patient";
import { usePatientSearch } from "@/features/patient/hooks/usePatientSearch";

import "./asyncSelect.css";

// Estilos personalizados
const selectStyles = {
  menu: (base) => ({ ...base, zIndex: 100 }),
  input: (base) => ({ ...base, textTransform: "uppercase" }),
  singleValue: (base) => ({ ...base, textTransform: "uppercase" }),
};

// Formato del dropdown
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// Obtener paciente completo por ID
async function getPatientById(id) {
  try {
    const res = await myclient.request(SEARCH_PATIENT_BY_ID, { id });
    return res?.patient ?? null;
  } catch (err) {
    console.error("getPatientById error:", err);
    return null;
  }
}

const AsyncPaginate_PatientSearch = forwardRef(function AsyncPaginate_PatientSearch(
  { onValChange },
  ref
) {
  const { searchPatients } = usePatientSearch();

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Debounce del input (400ms)
  const [debouncedInput] = useDebounce(inputValue, 400);

  // Exponer método para limpiar desde fuera
  useImperativeHandle(ref, () => ({
    clearSelect: () => {
      setSelectedValue(null);
      setInputValue("");
    },
  }));

  // Cargar opciones usando el valor debounced
  const loadOptions = useCallback(
    async (searchQuery, loadedOptions, { page = 1 }) => {
      const term = (debouncedInput || searchQuery).trim().toUpperCase();

      if (term.length < 2) {
        return {
          options: [],
          hasMore: false,
        };
      }

      const results = await searchPatients(term, page);

      const options = results.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        idTypeNo: p.idTypeNo,
      }));

      const hasMore = results.length === 20;

      return {
        options,
        hasMore,
        additional: {
          page: hasMore ? page + 1 : page,
        },
      };
    },
    [debouncedInput, searchPatients]
  );

  // Memoizamos la función para que AsyncPaginate la use correctamente
  const memoizedLoadOptions = useMemo(
    () => loadOptions,
    [loadOptions]
  );

  // Al seleccionar
  const handleChange = async (option) => {
    if (option) {
      const patient = await getPatientById(option.id);
      if (patient && typeof onValChange === "function") {
        onValChange(patient); // Enviamos el paciente completo al padre
      }
      setSelectedValue(option);
    } else {
      setSelectedValue(null);
      setInputValue("");
    }
  };

  // Forzar mayúsculas al escribir
  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      const upper = val.toUpperCase();
      setInputValue(upper);
      return upper;
    }
    return val;
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
      additional={{ page: 1 }}
      defaultOptions={false}
      debounceTimeout={400} // opcional: AsyncPaginate ya respeta el debounce interno
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 2
          ? "Escriba al menos 2 caracteres"
          : "No se encontraron pacientes"
      }
    />
  );
});

export default AsyncPaginate_PatientSearch;
