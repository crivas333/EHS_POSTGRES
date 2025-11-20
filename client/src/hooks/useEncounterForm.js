import { useState, useCallback } from "react";

export function useEncounterForm(initialValues) {
  const [values, setValues] = useState(initialValues || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reset = useCallback(
    (newValues = initialValues) => {
      setValues(newValues || initialValues);
    },
    [initialValues]
  );

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    callback(values);
  };

  return {
    values,
    setValues,
    handleInputChange,
    reset,
    handleSubmit,
  };
}


