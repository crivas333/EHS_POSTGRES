import { useState } from "react";

/**
 * A reusable form hook that handles input state, validation, and reset logic.
 *
 * @param {Object} initialFValues - The initial form field values.
 * @param {boolean} [validateOnChange=false] - Whether to run validation on every change.
 * @param {Function} [validate] - A validation function that returns { errors, isValid }.
 *
 * @returns {Object} { values, setValues, errors, setErrors, handleInputChange, resetForm, handleSubmit }
 */
export function useReusableFormGPT(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  /**
   * Handles change events for input fields.
   * Automatically updates form state and triggers validation if configured.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (validateOnChange && typeof validate === "function") {
      try {
        const { errors: validationErrors } = validate({ ...values, [name]: value });
        setErrors(validationErrors);
      } catch (err) {
        console.warn(`[useReusableFormGPT] Validation error for "${name}":`, err);
      }
    }
  };

  /**
   * Resets the form to its initial state.
   */
  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  /**
   * Returns a handler for form submission that validates and passes values to a callback.
   *
   * @param {Function} callback - The function to execute if validation passes.
   */
  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    if (typeof validate === "function") {
      const { errors: validationErrors, isValid } = validate(values);
      setErrors(validationErrors);
      if (!isValid) return;
    }
    if (typeof callback === "function") {
      callback(values);
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    handleSubmit,
  };
}

