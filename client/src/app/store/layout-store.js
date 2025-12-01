// src/app/store/layout-store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Importa AMBAS configuraciones
import leftDrawerConfig from '@app/config/drawer-config';
import rightDrawerConfig from '@app/config/drawer-right-config';

// Combina todas las secciones (izquierda + derecha)
const allDrawerConfigs = [...leftDrawerConfig, ...rightDrawerConfig];

const initialDrawerSections = allDrawerConfigs.reduce((acc, section) => {
  acc[section.stateKey] = section.defaultOpen ?? false;
  return acc;
}, {});

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      // Drawer visibility
      drawerLeftOpen: false,
      drawerRightOpen: false,

      // Estado de colapso/expansión de TODAS las secciones (izq + der)
      drawerSections: initialDrawerSections,

      // === Acciones de visibilidad de drawers ===
      toggleDrawerLeft: () => set((state) => ({ drawerLeftOpen: !state.drawerLeftOpen })),
      toggleDrawerRight: () => set((state) => ({ drawerRightOpen: !state.drawerRightOpen })),

      openDrawerLeft: () => set({ drawerLeftOpen: true }),
      openDrawerRight: () => set({ drawerRightOpen: true }),

      closeDrawerLeft: () => set({ drawerLeftOpen: false }),
      closeDrawerRight: () => set({ drawerRightOpen: false }),

      closeBothDrawers: () => set({ drawerLeftOpen: false, drawerRightOpen: false }),

      // Mobile: solo uno abierto a la vez
      openLeftDrawerMobile: () => set({ drawerLeftOpen: true, drawerRightOpen: false }),
      openRightDrawerMobile: () => set({ drawerLeftOpen: false, drawerRightOpen: true }),

      // === Acciones de secciones (colapso/expansión) ===
      toggleDrawerSection: (stateKey) =>
        set((state) => ({
          drawerSections: {
            ...state.drawerSections,
            [stateKey]: !state.drawerSections[stateKey],
          },
        })),

      setDrawerSection: (stateKey, isOpen) =>
        set((state) => ({
          drawerSections: {
            ...state.drawerSections,
            [stateKey]: isOpen,
          },
        })),

      expandDrawerSection: (stateKey) =>
        set((state) => ({
          drawerSections: { ...state.drawerSections, [stateKey]: true },
        })),

      collapseDrawerSection: (stateKey) =>
        set((state) => ({
          drawerSections: { ...state.drawerSections, [stateKey]: false },
        })),

      expandAllSections: () =>
        set({
          drawerSections: Object.keys(get().drawerSections).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
        }),

      collapseAllSections: () =>
        set({
          drawerSections: Object.keys(get().drawerSections).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {}),
        }),

      resetDrawerSections: () => set({ drawerSections: initialDrawerSections }),

      // Reset completo del layout
      resetLayout: () =>
        set({
          drawerLeftOpen: false,
          drawerRightOpen: false,
          drawerSections: initialDrawerSections,
        }),
    }),
    {
      name: 'layout-storage-v2',
      version: 2, // Cambiado a v2 por nueva estructura
      partialize: (state) => ({
        drawerLeftOpen: state.drawerLeftOpen,
        drawerRightOpen: state.drawerRightOpen,
        drawerSections: state.drawerSections,
      }),
      // Crucial: asegura compatibilidad si cambias config
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const currentSections = allDrawerConfigs.reduce((acc, section) => {
          acc[section.stateKey] = section.defaultOpen ?? false;
          return acc;
        }, {});

        // Merge: mantener estados guardados, pero añadir nuevas secciones
        state.drawerSections = {
          ...currentSections,
          ...state.drawerSections,
        };
      },
    }
  )
);

// === Hooks auxiliares (opcionales pero muy útiles) ===
export const useDrawerVisibility = () => {
  const {
    drawerLeftOpen,
    drawerRightOpen,
    toggleDrawerLeft,
    toggleDrawerRight,
    openLeftDrawerMobile,
    openRightDrawerMobile,
    closeBothDrawers,
  } = useLayoutStore();

  return {
    drawerLeftOpen,
    drawerRightOpen,
    toggleDrawerLeft,
    toggleDrawerRight,
    openLeftDrawerMobile,
    openRightDrawerMobile,
    closeBothDrawers,
  };
};

export const useDrawerSection = (stateKey) => {
  const isOpen = useLayoutStore((state) => state.drawerSections[stateKey] ?? false);
  const toggle = useLayoutStore((state) => state.toggleDrawerSection);

  return [isOpen, () => toggle(stateKey)];
};