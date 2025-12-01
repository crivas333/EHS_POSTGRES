// src/components/reusableForms/useReusableFormAppointment.jsx
import { useState } from "react";

export function useReusableFormAppointment(initialValues, validateOnChange = false, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Universal input handler (text, select, or date pickers)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      if (validateOnChange && validateFn) {
        const { errors: newErrors } = validateFn(updatedValues, updatedValues, errors);
        setErrors(newErrors);
      }

      return updatedValues;
    });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const validate = () => {
    if (!validateFn) return true;
    const { errors: newErrors, isValid } = validateFn(values, values, errors);
    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validate,
  };
}
