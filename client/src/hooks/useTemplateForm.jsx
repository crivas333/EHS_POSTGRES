// useReusableForm.jsx
import { useState } from "react";

// ✅ Custom hook for form state & validation
export function useTemplateForm(
  initialFValues,
  validateOnChange = false,
  validate
) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  // Handle all input types (text, checkbox, radio, select, etc.)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });

    if (validateOnChange && typeof validate === "function") {
      validate({ [name]: type === "checkbox" ? checked : value });
    }
  };

  // Reset form (optionally to new values)
  const resetForm = (newValues = initialFValues) => {
    setValues(newValues);
    setErrors({});
  };

  // Optional submit handler (so you can just call handleSubmit inside forms)
  const handleSubmit = (e, onSubmit) => {
    if (e) e.preventDefault();
    if (typeof validate === "function") {
      const validationErrors = validate(values);
      setErrors(validationErrors || {});
      if (validationErrors && Object.keys(validationErrors).length !== 0)
        return;
    }
    if (typeof onSubmit === "function") {
      onSubmit(values, resetForm);
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

// ✅ Wrapper for form components
export function ReusableForm({ children, onSubmit, ...other }) {
  return (
    <form autoComplete="off" onSubmit={onSubmit} {...other}>
      {children}
    </form>
  );
}
