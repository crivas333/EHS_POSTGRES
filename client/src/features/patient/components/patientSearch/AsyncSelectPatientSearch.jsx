
// client/src/components/patient/patientSearch/AsyncSelectPatientSearch.jsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import debounce from "lodash.debounce";

import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_PATIENT_BY_ID } from "@/features/patient/api/gqlQueries_patient";
import { usePatientSearch } from "@/features/patient/hooks/usePatientSearch";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { useTheme } from "@mui/material/styles";
import { getSelectStyles } from "@/theme/selectStyles";

import "./asyncSelect.css";

// ✅ Label format helper
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// ✅ Helper: fetch full patient record by ID
async function getPatientById(id) {
  try {
    const res = await myclient.request(SEARCH_PATIENT_BY_ID, { id });
    return res?.patient ?? null;
  } catch (err) {
    console.error("❌ getPatientById error:", err);
    return null;
  }
}

// ✅ Main component
const AsyncSelectPatientSearch = forwardRef(function AsyncSelectPatientSearch(
  { setOptions }, // optional prop from parent (like PatientView)
  ref
) {
  const theme = useTheme();
  const selectStyles = getSelectStyles(theme);
  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);
  const { searchPatients } = usePatientSearch();

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // ----------------- Expose imperative methods -----------------
  useImperativeHandle(ref, () => ({
    clearSelect: () => {
      setSelectedValue(null);
      setInputValue("");
      setCurrentPatient(null);
    },
    refreshOptions: async () => {
      // Clears input to trigger new fetch next time
      setInputValue("");
    },
  }));

  // ----------------- Fetch paginated options -----------------
  const fetchOptions = useCallback(
    async (inputVal, loadedOptions, additional) => {
      const trimmedAndUpper = inputVal.trim().toUpperCase();
      if (trimmedAndUpper.length < 2) {
        return { options: [], hasMore: false, additional: { page: 0 } };
      }

      const page = additional?.page ?? 1;
      const results = await searchPatients(trimmedAndUpper, page);

      const options = results.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        idTypeNo: p.idTypeNo,
      }));

      // ✅ Report options to parent (optional)
      if (setOptions) setOptions(options);

      const hasMore = results.length === 20;
      return {
        options,
        hasMore,
        additional: { page: hasMore ? page + 1 : page },
      };
    },
    [searchPatients, setOptions]
  );

  // ----------------- Debounced fetching -----------------
  const debouncedFetchOptions = useMemo(() => {
    const fn = debounce(
      async (input, loaded, additional, resolve) => {
        try {
          const res = await fetchOptions(input, loaded, additional);
          resolve(res);
        } catch (err) {
          console.error("❌ Debounced fetch error:", err);
          resolve({ options: [], hasMore: false, additional: { page: 0 } });
        }
      },
      400,
      { leading: false, trailing: true }
    );

    return (input, loaded, additional) =>
      new Promise((resolve) => fn(input, loaded, additional, resolve));
  }, [fetchOptions]);

  // ----------------- Handle user selection -----------------
  const handleChange = async (option) => {
    if (option) {
      const patient = await getPatientById(option.id);
      if (patient) setCurrentPatient(patient);
      setSelectedValue(option);

      // optional: auto-clear after short delay
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

  // ----------------- Handle input -----------------
  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      const upper = val.toUpperCase();
      setInputValue(upper);
      return upper;
    }
    return "";
  };

  // ----------------- Render -----------------
  return (
    <AsyncPaginate
      styles={selectStyles}
      loadOptions={debouncedFetchOptions}
      value={selectedValue}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      placeholder="Busque por nombre, apellido o número de identificación"
      isClearable
      cacheOptions
      additional={{ page: 0 }}
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
