// src/features/patient/ui/DisplayPatient.jsx
import React from "react";

//import { usePatient } from "@/features/patient";

import {
  PatientTabFormLayout,
  DisplayPatientTab1,
  DisplayPatientTab2,
  DisplayPatientTab3,
  usePatient,
} from "@/features/patient";

export default function DisplayPatient() {
  const { currentPatient } = usePatient();

  if (!currentPatient) {
    return <div style={{ padding: "1rem", opacity: 0.7 }}>No patient selected.</div>;
  }

  const tabs = [
    { label: "Datos Personales", component: <DisplayPatientTab1 patient={currentPatient} /> },
    { label: "Datos de Contacto", component: <DisplayPatientTab2 patient={currentPatient} /> },
    { label: "Datos Médicos", component: <DisplayPatientTab3 patient={currentPatient} /> },
  ];

  return (
    <PatientTabFormLayout
      values={currentPatient}
      tabs={tabs}
      onSubmit={() => {}}
      handleCancel={() => {}}
    />
  );
}
