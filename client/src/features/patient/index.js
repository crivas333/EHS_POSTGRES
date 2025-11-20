// ===============================
//  Patient Feature Barrel File
// ===============================

// 🧬 API (GraphQL Queries / Mutations)
export * from "./api/gqlQueries_patient";

// 🪝 Hooks
export * from "./hooks/usePatientSearch";
export * from "./hooks/usePatient";
export * from "./hooks/useCreatePatient";
export * from "./hooks/useUpdatePatient";
export * from "./hooks/useDeletePatient";
export * from "./hooks/usePatientActions";

// 🗂 Store (optional)
// export * from "./store";

// 📄 Shared Layout
export { default as PatientTabFormLayout } from "./shared/PatientTabFormLayout.jsx";

// 📦 UI Components
export { default as PatientSummary } from "./ui/PatientSummary";

// Unified Patient Form (replaces New/Update/Display forms)
export { default as PatientTabForm } from "./ui/PatientTabForm.jsx";
export { default as DisplayPatientTabForm } from "./ui/DisplayPatientTabForm.jsx";
export { default as NewPatientTabForm } from "./ui/NewPatientTabForm.jsx";
export { default as UpdatePatientTabForm } from "./ui/UpdatePatientTabForm.jsx";

// Optional: export individual tabs if needed elsewhere
export { default as DisplayPatientTab1 } from "./ui/DisplayPatientTab1.jsx";
export { default as DisplayPatientTab2 } from "./ui/DisplayPatientTab2.jsx";
export { default as DisplayPatientTab3 } from "./ui/DisplayPatientTab3.jsx";

export { default as NewPatientTab1 } from "./ui/NewPatientTab1.jsx";
export { default as NewPatientTab2 } from "./ui/NewPatientTab2.jsx";
export { default as NewPatientTab3 } from "./ui/NewPatientTab3.jsx";

export { default as UpdatePatientTab1 } from "./ui/UpdatePatientTab1.jsx";
export { default as UpdatePatientTab2 } from "./ui/UpdatePatientTab2.jsx";
export { default as UpdatePatientTab3 } from "./ui/UpdatePatientTab3.jsx";

// 🔍 Patient Search Components
export { default as AsyncSelectPatientSearch } 
  from "./components/patientSearch/AsyncSelectPatientSearch.jsx";

export { default as AsyncSelectModalDialog } 
  from "./components/patientSearch/AsyncSelectModalDialog.jsx";

// Optional Display wrapper
export { default as DisplayPatient } from "./ui/DisplayPatient.jsx";
