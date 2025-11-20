import React, { useEffect } from "react";
import { usePatientStore } from "@/state/zustand/ZustandStore.js";
import { usePatientForm } from "../hooks/usePatientForm.js";
import PatientTabFormLayout from "@/features/patient/shared/PatientTabFormLayout.jsx";
import { initialPatientValues } from "@/utils/patientFormDefaults.js";

import UpdatePatientTab1 from "./UpdatePatientTab1.jsx";
import UpdatePatientTab2 from "./UpdatePatientTab2.jsx";
import UpdatePatientTab3 from "./UpdatePatientTab3.jsx";

export default function UpdatePatientTabForm({ updatePatient, handleCancel }) {
  const currentPatient = usePatientStore((state) => state.currentPatient);

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    setValues,
  } = usePatientForm(initialPatientValues, (vals) => {
    if (!vals.id) return console.error("Patient ID missing!");

    updatePatient.mutate({
      variables: {
        id: vals.id,
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

  // Load current patient into form
  useEffect(() => {
    if (currentPatient) setValues(currentPatient);
  }, [currentPatient, setValues]);

  return (
    <PatientTabFormLayout
      values={values}
      errors={errors}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      handleCancel={handleCancel}
      tabs={[
        { label: "Datos", component: <UpdatePatientTab1 values={values} errors={errors} onChange={handleInputChange} /> },
        { label: "Contacto", component: <UpdatePatientTab2 values={values} errors={errors} onChange={handleInputChange} /> },
        { label: "Misc", component: <UpdatePatientTab3 values={values} errors={errors} onChange={handleInputChange} /> },
      ]}
    />
  );
}
