
// =======================================================
// PatientForm.jsx
// Smart wrapper for Display / New / Update patient forms
// =======================================================

import React from "react";

// Import the 3 form modes
import NewPatientTabForm from "./NewPatientTabForm";
import UpdatePatientTabForm from "./UpdatePatientTabForm";
import DisplayPatientTabForm from "./DisplayPatientTabForm";

export default function PatientForm({ mode = "display", ...props }) {
  if (mode === "new") {
    return <NewPatientTabForm {...props} />;
  }

  if (mode === "update") {
    return <UpdatePatientTabForm {...props} />;
  }

  // default → display mode
  return <DisplayPatientTabForm {...props} />;
}
