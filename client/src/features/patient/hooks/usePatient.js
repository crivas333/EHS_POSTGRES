// ================================================
// usePatient.js
// A unified hook for managing the current patient
// ================================================
import { useCallback, useMemo } from "react";
import { usePatientStore } from "@/state/zustand/ZustandStore";

export function usePatient() {
  const currentPatient = usePatientStore((s) => s.currentPatient);
  const setCurrentPatient = usePatientStore((s) => s.setCurrentPatient);

  // Set whole patient object
  const selectPatient = useCallback(
    (patient) => {
      if (!patient || typeof patient !== "object") {
        console.warn("usePatient.selectPatient: invalid patient", patient);
        return;
      }

      setCurrentPatient({ ...patient }); // ensure immutability
    },
    [setCurrentPatient]
  );

  // Clear patient
  const clearPatient = useCallback(() => {
    setCurrentPatient(null);
  }, [setCurrentPatient]);

  // Simple helpers
  const patientId = currentPatient?.id ?? null;
  const fullName = useMemo(() => {
    if (!currentPatient) return "";
    return `${currentPatient.firstName ?? ""} ${currentPatient.lastName ?? ""}`.trim();
  }, [currentPatient]);

  const isSelected = Boolean(currentPatient);

  return {
    currentPatient,
    patientId,
    fullName,
    isSelected,

    selectPatient,
    clearPatient,
  };
}

export default usePatient;
