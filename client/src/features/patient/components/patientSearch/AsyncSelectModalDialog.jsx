
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
import "./asyncSelect.css";

// ✅ Custom styles
const selectStyles = {
  menu: (base) => ({ ...base, zIndex: 100 }),
  input: (base) => ({ ...base, textTransform: "uppercase" }),
  singleValue: (base) => ({ ...base, textTransform: "uppercase" }),
};

// ✅ Label format for dropdown
const formatOptionLabel = ({ id, fullName, idTypeNo }) => (
  <span>{`${id} - ${fullName} (${idTypeNo})`}</span>
);

// ✅ Helper: Fetch full patient info by ID
async function getPatientById(id) {
  try {
    const res = await myclient.request(SEARCH_PATIENT_BY_ID, { id });
    return res?.patient ?? null;
  } catch (err) {
    console.error("❌ getPatientById error:", err);
    return null;
  }
}

const AsyncPaginate_PatientSearch = forwardRef(function AsyncSelectPatientSearch(
  { onValChange }, // ✅ Local-only callback
  ref
) {
  const { searchPatients } = usePatientSearch();

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // ✅ Expose method for clearing selection
  useImperativeHandle(ref, () => ({
    clearSelect: () => {
      setSelectedValue(null);
      setInputValue("");
    },
  }));

  // ✅ Fetch paginated options
  const fetchOptions = useCallback(
    async (inputValue, loadedOptions, additional) => {
      const trimmed = inputValue.trim().toUpperCase();
      if (trimmed.length < 2) {
        return {
          options: [],
          hasMore: false,
          additional: { page: 0 },
        };
      }

      const page = additional?.page ?? 1;
      const results = await searchPatients(trimmed, page);

      const options = results.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        idTypeNo: p.idTypeNo,
      }));

      const hasMore = results.length === 20;
      return {
        options,
        hasMore,
        additional: { page: hasMore ? page + 1 : page },
      };
    },
    [searchPatients]
  );

  // ✅ Debounce fetch
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

  // ✅ Handle user selection
  const handleChange = async (option) => {
    if (option) {
      const patient = await getPatientById(option.id);
      if (patient && typeof onValChange === "function") {
        onValChange(patient); // ✅ Send patient to parent
      }
      setSelectedValue(option);
    } else {
      setSelectedValue(null);
      setInputValue("");
    }
  };

  // ✅ Uppercase input typing
  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      const upper = val.toUpperCase();
      setInputValue(upper);
      return upper;
    }
    return "";
  };

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

export default AsyncPaginate_PatientSearch;

