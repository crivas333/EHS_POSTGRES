
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@mui/material";
import PatientTabFormLayout from "@/features/patient/shared/PatientTabFormLayout.jsx";
import { useReusableFormGPT } from "@/hooks/useReusableFormGPT.js";
import { initialPatientValues } from "@/utils/patientFormDefaults.js";

// Unified Tab components
import PatientTab1 from "./PatientTab1.jsx";
import PatientTab2 from "./PatientTab2.jsx";
import PatientTab3 from "./PatientTab3.jsx";

export default function PatientTabForm({ mode = "display", mutation, handleCancel }) {
  const readOnly = mode === "display";

  const { values, setValues, errors, setErrors, handleInputChange } = useReusableFormGPT(
    initialPatientValues,
    !readOnly
  );

  useEffect(() => {
    if (mode === "create") {
      setValues(initialPatientValues);
    }
  }, [mode, setValues]);

  const handleSubmit = () => {
    if (!mutation) return;

    const payload =
      mode === "create"
        ? { variables: { patientInput: { ...values } } }
        : { variables: { id: values.id, patientInput: { ...values } } };

    mutation.mutate(payload);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const handleChangeTab = useCallback((_, newValue) => setSelectedTab(newValue), []);

  const tabs = [
    { label: "Datos", component: <PatientTab1 values={values} errors={errors} onChange={handleInputChange} readOnly={readOnly} /> },
    { label: "Contacto", component: <PatientTab2 values={values} errors={errors} onChange={handleInputChange} readOnly={readOnly} /> },
    { label: "Misc", component: <PatientTab3 values={values} errors={errors} onChange={handleInputChange} readOnly={readOnly} /> },
  ];

  return (
    <PatientTabFormLayout
      values={values}
      errors={errors}
      setErrors={setErrors}
      handleInputChange={handleInputChange}
      onSubmit={readOnly ? () => {} : handleSubmit}
      handleCancel={handleCancel}
      activeTab={selectedTab}
      onChangeTab={handleChangeTab}
      tabs={tabs}
    >
      {!readOnly && (
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {mode === "create" ? "CREAR" : "ACTUALIZAR"}
        </Button>
      )}
    </PatientTabFormLayout>
  );
}
