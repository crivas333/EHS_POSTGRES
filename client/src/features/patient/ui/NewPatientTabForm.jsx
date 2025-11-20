import React, { useEffect } from "react";
import { usePatientForm } from "../hooks/usePatientForm.js";
import PatientTabFormLayout from "@/features/patient/shared/PatientTabFormLayout.jsx";
import { initialPatientValues } from "@/utils/patientFormDefaults.js";

import NewPatientTab1 from "./NewPatientTab1.jsx";
import NewPatientTab2 from "./NewPatientTab2.jsx";
import NewPatientTab3 from "./NewPatientTab3.jsx";

export default function NewPatientTabForm({ createPatient, handleCancel }) {
  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    setValues,
  } = usePatientForm(initialPatientValues, (vals) => {
    createPatient.mutate({
      variables: {
        patientInput: {
          idType: vals.idType,
          idTypeNo: vals.idTypeNo?.toUpperCase() || "",
          firstName: vals.firstName?.toUpperCase() || "",
          lastName: vals.lastName?.toUpperCase() || "",
          lastName2: vals.lastName2?.toUpperCase() || "",
          birthDay: vals.birthDay || null,
          sex: vals.sex,
          phone1: vals.phone1 || "",
          phone2: vals.phone2 || "",
          email: vals.email?.toUpperCase() || "",
          address: vals.address?.toUpperCase() || "",
          gName: vals.gName?.toUpperCase() || "",
          gPhone1: vals.gPhone1 || "",
          gPhone2: vals.gPhone2 || "",
          gRelation: vals.gRelation?.toUpperCase() || "",
          bloodType: vals.bloodType || "",
          marital: vals.marital || "",
          occupation: vals.occupation?.toUpperCase() || "",
          religion: vals.religion?.toUpperCase() || "",
          referral: vals.referral?.toUpperCase() || "",
        },
      },
    });
  });

  // Reset form on mount
  useEffect(() => setValues(initialPatientValues), [setValues]);

  return (
    <PatientTabFormLayout
      values={values}
      errors={errors}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      handleCancel={handleCancel}
      tabs={[
        { label: "Datos", component: <NewPatientTab1 values={values} errors={errors} onChange={handleInputChange} /> },
        { label: "Contacto", component: <NewPatientTab2 values={values} errors={errors} onChange={handleInputChange} /> },
        { label: "Misc", component: <NewPatientTab3 values={values} errors={errors} onChange={handleInputChange} /> },
      ]}
    />
  );
}
