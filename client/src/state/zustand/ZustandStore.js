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
      set({ notification: { open: true, message, status } }),

    hide: () =>
      set((state) => ({
        notification: { ...state.notification, open: false },
      })),
  }))
);

/* ============================================================
   ENCOUNTERS STORE — UI STATE ONLY
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

      if (!get().encountersByPatient[patientId]) {
        set((state) => ({
          encountersByPatient: {
            ...state.encountersByPatient,
            [patientId]: JSON.parse(JSON.stringify(DEFAULT_ENCOUNTER_STATE)),
          },
        }));
      }
    },

    /* ------------------------------
       GETTERS
    ------------------------------ */
    getStateFor: (id) => get().encountersByPatient[id] || null,
    getPagination: (id) =>
      get().encountersByPatient[id]?.pagination ?? DEFAULT_ENCOUNTER_STATE.pagination,
    getSorting: (id) =>
      get().encountersByPatient[id]?.sorting ?? DEFAULT_ENCOUNTER_STATE.sorting,
    getOpenSections: (id) =>
      get().encountersByPatient[id]?.openSections ?? DEFAULT_ENCOUNTER_STATE.openSections,

    /* ------------------------------
       SETTERS
    ------------------------------ */
    setSelectedEncounterId: (patientId, value) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.selectedEncounterId = value;
        return { encountersByPatient: { ...state.encountersByPatient } };
      }),

    toggleSection: (patientId, key) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.openSections[key] = !patient.openSections[key];
        return { encountersByPatient: { ...state.encountersByPatient } };
      }),

    setPagination: (patientId, pagination) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.pagination = pagination;
        return { encountersByPatient: { ...state.encountersByPatient } };
      }),

    setSorting: (patientId, sorting) =>
      set((state) => {
        const patient = state.encountersByPatient[patientId];
        if (!patient) return state;

        patient.sorting = sorting;
        return { encountersByPatient: { ...state.encountersByPatient } };
      }),
  }))
);

/* ============================================================
   ENCOUNTER UI STORE — SIDEBAR + MODULES
   ============================================================ */
export const useEncounterUIStore = create((set) => ({
  activeModule: "encounters",
  openAccordions: ["encounters"],
  mobileSidebarOpen: false,

  setActiveModule: (key) => set({ activeModule: key }),

  toggleAccordion: (key) =>
    set((state) => ({
      openAccordions: state.openAccordions.includes(key)
        ? state.openAccordions.filter((k) => k !== key)
        : [...state.openAccordions, key],
    })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  goBack: () => set({ activeModule: "encounters" }),
}));

/* ============================================================
   Debugging Helper
   ============================================================ */
if (typeof window !== "undefined") {
  window.useEncountersStore = useEncountersStore;
}
