// src/hooks/usePatientForm.jsx
import { useState, useCallback } from "react";
import { validatePatient } from "@/utils/validatorsPatient.js";

/**
 * usePatientForm
 * @param {object} initialValues - starting values for the form
 * @param {function} onSubmitCallback - function called with validated values on submit
 */
export function usePatientForm(initialValues, onSubmitCallback) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Main submit handler
  const handleSubmit = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();

      const { errors: validationErrors, isValid } = validatePatient(values);
      setErrors(validationErrors);

      if (!isValid) return;

      if (!onSubmitCallback) {
        console.error("onSubmit callback not provided!");
        return;
      }

      // Call the provided mutation function with formatted values
      onSubmitCallback(values);
    },
    [values, onSubmitCallback]
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
