
// src/zustand/ZustandStore.js
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/* ============================================================
   AUTH STORE
   ============================================================ */
export const useAuthStore = create(
  subscribeWithSelector((set) => ({
    isAuth: false,
    currentUser: null,

    setIsAuth: (isAuth) => set({ isAuth }),
    setCurrentUser: (currentUser) => set({ currentUser }),
  }))
);

/* ============================================================
   PATIENT STORE
   ============================================================ */
export const usePatientStore = create(
  subscribeWithSelector((set) => ({
    currentPatient: null,
    setCurrentPatient: (currentPatient) => set({ currentPatient }),
  }))
);

/* ============================================================
   SEARCH STORE
   ============================================================ */
export const useSearchStore = create(
  subscribeWithSelector((set) => ({
    searchDate: new Date(),
    setSearchDate: (searchDate) => set({ searchDate }),
  }))
);

/* ============================================================
   NOTIFICATION STORE
   ============================================================ */
export const useNotificationStore = create(
  subscribeWithSelector((set) => ({
    notification: { open: false, message: "", status: "info" },

    show: (message, status = "info") =>
      set({
        notification: { open: true, message, status },
      }),

    hide: () =>
      set((state) => ({
        notification: { ...state.notification, open: false },
      })),
  }))
);

/* ============================================================
   ENCOUNTERS STORE — ULTRA-OPTIMIZED
   ============================================================ */

const DEFAULT_ENCOUNTER_STATE = {
  selectedEncounterId: null,
  openSections: {
    encounters: true,
    visualAcuity: false,
    refraction: false,
  },
  pagination: { page: 0, rowsPerPage: 10 },
  sorting: { orderBy: "start", order: "desc" },
};

export const useEncountersStore = create(
  subscribeWithSelector((set, get) => ({
    encountersByPatient: {},

    initPatientState: (patientId) => {
      if (!patientId) return;
      const exists = get().encountersByPatient[patientId];
      if (exists) return;

      set((state) => ({
        encountersByPatient: {
          ...state.encountersByPatient,
          [patientId]: JSON.parse(JSON.stringify(DEFAULT_ENCOUNTER_STATE)),
        },
      }));
    },

    /* Getters */
    getStateFor: (patientId) => get().encountersByPatient[patientId] || null,
    getPagination: (patientId) =>
      get().encountersByPatient[patientId]?.pagination || { page: 0, rowsPerPage: 10 },
    getSorting: (patientId) =>
      get().encountersByPatient[patientId]?.sorting || { orderBy: "start", order: "desc" },
    getOpenSections: (patientId) =>
      get().encountersByPatient[patientId]?.openSections,

    /* Setters */
    setSelectedEncounterId: (patientId, value) => {
      console.log('Zustand Store - Setting selectedEncounterId:', { patientId, value });
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.selectedEncounterId = value;
        return { encountersByPatient: state.encountersByPatient };
      });
    },

    toggleSection: (patientId, key) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.openSections[key] = !patient.openSections[key];
        return { encountersByPatient: state.encountersByPatient };
      }),

    setPagination: (patientId, pagination) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.pagination = pagination;
        return { encountersBycentersByPatient: state.encountersByPatient };
      }),

    setSorting: (patientId, sorting) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.sorting = sorting;
        return { encountersByPatient: state.encountersByPatient };
      }),
  }))
);

/* ============================================================
   ENCOUNTER DASHBOARD STORE
   ============================================================ */
export const useEncounterDashboardStore = create(
  subscribeWithSelector((set, get) => ({
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
  }))
);
// In ZustandStore.js - update useEncounterUIStore
export const useEncounterUIStore = create((set) => ({
  activeModule: "encounters",
  openAccordions: ["encounters"],

  setActiveModule: (moduleKey) =>
    set(() => ({
      activeModule: moduleKey,
    })),

  // Add this missing function
  setActiveAccordion: (moduleKey) =>
    set(() => ({
      activeModule: moduleKey,
    })),

  toggleAccordion: (moduleKey) =>
    set((state) => ({
      openAccordions: state.openAccordions.includes(moduleKey)
        ? state.openAccordions.filter((key) => key !== moduleKey)
        : [...state.openAccordions, moduleKey],
    })),
}));
/* ============================================================
   Convenience Hooks
   ============================================================ */
export const useActiveModule = () =>
  useEncounterDashboardStore((s) => s.activeModule);

export const useSetActiveModule = () =>
  useEncounterDashboardStore((s) => s.setActiveModule);

export const useGoBack = () =>
  useEncounterDashboardStore((s) => s.goBack);



/* ============================================================
   Debug Helper
   ============================================================ */
   
if (typeof window !== "undefined") {
  window.useEncountersStore = useEncountersStore;
}
