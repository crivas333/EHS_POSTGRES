// src/zustand/index.js
import { create } from "zustand";

/* ============================================================
   AUTH STORE
   ============================================================ */
export const useAuthStore = create((set) => ({
  isAuth: false,
  currentUser: null,

  setIsAuth: (isAuth) => set({ isAuth }),
  setCurrentUser: (currentUser) => set({ currentUser }),
}));

/* ============================================================
   PATIENT STORE
   ============================================================ */
export const usePatientStore = create((set) => ({
  currentPatient: null,
  setCurrentPatient: (currentPatient) => set({ currentPatient }),
}));

/* ============================================================
   SEARCH STORE
   ============================================================ */
export const useSearchStore = create((set) => ({
  searchDate: new Date(),
  setSearchDate: (searchDate) => set({ searchDate }),
}));

/* ============================================================
   NOTIFICATION STORE
   ============================================================ */
export const useNotificationStore = create((set) => ({
  notification: { open: false, message: "", status: "info" },

  show: (message, status = "info") =>
    set({ notification: { open: true, message, status } }),

  hide: () =>
    set((state) => ({
      notification: { ...state.notification, open: false },
    })),
}));

/* ============================================================
   ENCOUNTERS STORE — PERSISTED UI STATE PER PATIENT
   ============================================================ */
export const useEncountersStore = create((set, get) => ({
  encountersByPatient: {},

  /* Initialize per-patient UI state (only once) */
  initPatientState: (patientId) =>
    set((state) => {
      if (!patientId) return state;
      if (state.encountersByPatient[patientId]) return state;

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            selectedEncounterId: null,

            openSections: {
              encounters: true,
              visualAcuity: false,
              refraction: false,
            },

            pagination: { page: 0, rowsPerPage: 10 },
            sorting: { orderBy: "start", order: "desc" },
          },
        },
      };
    }),

  /* Getters */
  getStateFor: (patientId) => get().encountersByPatient[patientId] ?? null,
  getPagination: (patientId) => get().encountersByPatient[patientId]?.pagination,
  getSorting: (patientId) => get().encountersByPatient[patientId]?.sorting,

  /* Setters */
  setSelectedEncounterId: (patientId, selectedEncounterId) =>
    set((state) => {
      if (!state.encountersByPatient[patientId]) return state;

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            ...state.encountersByPatient[patientId],
            selectedEncounterId,
          },
        },
      };
    }),

  toggleSection: (patientId, key) =>
    set((state) => {
      const patient = state.encountersByPatient[patientId];
      if (!patient) return state;

      const newSections = {
        ...patient.openSections,
        [key]: !patient.openSections[key],
      };

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            ...patient,
            openSections: newSections,
          },
        },
      };
    }),

  setPagination: (patientId, pagination) =>
    set((state) => {
      if (!state.encountersByPatient[patientId]) return state;

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            ...state.encountersByPatient[patientId],
            pagination,
          },
        },
      };
    }),

  setSorting: (patientId, sorting) =>
    set((state) => {
      if (!state.encountersByPatient[patientId]) return state;

      return {
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: {
            ...state.encountersByPatient[patientId],
            sorting,
          },
        },
      };
    }),
}));

/* ============================================================
   ENCOUNTER DASHBOARD STORE — ACTIVE MODULE + MODULE STATE
   ============================================================ */
export const useEncounterDashboardStore = create((set, get) => ({
  activeModule: "encounters",
  moduleStates: {},

  setActiveModule: (moduleName) => {
    console.log("Setting active module:", moduleName);
    set({ activeModule: moduleName });
  },

  setModuleState: (moduleName, state) =>
    set((current) => ({
      moduleStates: {
        ...current.moduleStates,
        [moduleName]: state,
      },
    })),

  getModuleState: (moduleName) => get().moduleStates[moduleName],

  goBack: () => set({ activeModule: "encounters" }),
}));

/* Convenience hooks */
export const useActiveModule = () =>
  useEncounterDashboardStore((state) => state.activeModule);

export const useSetActiveModule = () =>
  useEncounterDashboardStore((state) => state.setActiveModule);

export const useGoBack = () =>
  useEncounterDashboardStore((state) => state.goBack);

/* Debug */
if (typeof window !== "undefined") {
  window.useEncountersStore = useEncountersStore;
}




