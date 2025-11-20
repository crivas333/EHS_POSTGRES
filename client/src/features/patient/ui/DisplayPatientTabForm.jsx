import React, { useState } from "react";
import PatientTabFormLayout from "@/features/patient/shared/PatientTabFormLayout.jsx";
import { usePatientStore } from "@/state/zustand/ZustandStore.js";
import DisplayPatientTab1 from "./DisplayPatientTab1.jsx";
import DisplayPatientTab2 from "./DisplayPatientTab2.jsx";
import DisplayPatientTab3 from "./DisplayPatientTab3.jsx";
import { initialPatientValues } from "@/utils/patientFormDefaults.js";

export default function DisplayPatientTabForm() {
  const currentPatient = usePatientStore((state) => state.currentPatient);
  const values = currentPatient || initialPatientValues;
  const [activeTab] = useState(0);

  return (
    <PatientTabFormLayout
      activeTab={activeTab}
      readOnly
      tabs={[
        { label: "Datos", component: <DisplayPatientTab1 values={values} /> },
        { label: "Contacto", component: <DisplayPatientTab2 values={values} /> },
        { label: "Misc", component: <DisplayPatientTab3 values={values} /> },
      ]}
    />
  );
}
