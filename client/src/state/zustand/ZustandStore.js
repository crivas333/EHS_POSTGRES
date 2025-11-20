
import { create } from "zustand";
//import { shallow } from "zustand/shallow";

/* ============================================================================
   Optimized Zustand Store
   - Immutable updates
   - Stable per-patient state
   - No accidental object mutation
   - Selector-friendly
   ============================================================================ */

export const useAuthStore = create((set) => ({
  isAuth: false,
  currentUser: null,
  setIsAuth: (isAuth) => set({ isAuth }),
  setCurrentUser: (currentUser) => set({ currentUser }),
}));

export const usePatientStore = create((set) => ({
  currentPatient: null,
  setCurrentPatient: (currentPatient) => set({ currentPatient }),
}));

export const useSearchStore = create((set) => ({
  searchDate: new Date(),
  setSearchDate: (searchDate) => set({ searchDate }),
}));

export const useNotificationStore = create((set) => ({
  notification: { open: false, message: "", status: "info" },
  show: (message, status = "info") =>
    set({ notification: { open: true, message, status } }),
  hide: () =>
    set((state) => ({
      notification: { ...state.notification, open: false },
    })),
}));

/* ============================================================================
   Encounters Store (PER PATIENT)
   ============================================================================ */
export const useEncountersStore = create((set, get) => ({
  encountersByPatient: {},

  // Initialize state only once per patient
  initPatientState: (patientId) =>
    set((state) => {
      if (!patientId) return state;
      if (state.encountersByPatient[patientId]) return state; // already exists

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            selectedEncounterId: null,
            //selectedAppointmentId: null,
            openSections: {
              encounters: true,
              visualAcuity: false,
              //eyeTest: false,
              refraction: false,
            },
            pagination: { page: 0, rowsPerPage: 10 },
            sorting: { orderBy: "start", order: "desc" },
          },
        },
      };
    }),

  // Getters
  getStateFor: (patientId) => get().encountersByPatient[patientId] ?? null,
  getPagination: (patientId) => get().encountersByPatient[patientId]?.pagination,
  getSorting: (patientId) => get().encountersByPatient[patientId]?.sorting,

  // Setters (all immutable)
  setSelectedEncounterId: (patientId, selectedEncounterId) =>
    set((state) => ({
      encountersByPatient: {
        ...state.encountersByPatient,
        [patientId]: {
          ...state.encountersByPatient[patientId],
          selectedEncounterId,
        },
      },
    })),

  toggleSection: (patientId, key) =>
    set((state) => {
      const patient = state.encountersByPatient[patientId];
      if (!patient) return state;

      const updated = {
        ...patient,
        openSections: {
          ...patient.openSections,
          [key]: !patient.openSections[key],
        },
      };

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: updated,
        },
      };
    }),

  setPagination: (patientId, pagination) =>
    set((state) => ({
      encountersByPatient: {
        ...state.encountersByPatient,
        [patientId]: {
          ...state.encountersByPatient[patientId],
          pagination,
        },
      },
    })),

  setSorting: (patientId, sorting) =>
    set((state) => ({
      encountersByPatient: {
        ...state.encountersByPatient,
        [patientId]: {
          ...state.encountersByPatient[patientId],
          sorting,
        },
      },
    })),
}));

/* ============================================================================
   Encounter API Cache Store
   ============================================================================ */


// Debug Hook
if (typeof window !== "undefined") {
  window.useEncountersStore = useEncountersStore;
}



