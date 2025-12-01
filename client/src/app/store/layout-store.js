//src/app/store/layout-store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import drawerConfig from '@app/config/drawer-config';

// Initialize drawer sections state from config
const initialDrawerSections = drawerConfig.reduce((acc, section) => {
  acc[section.stateKey] = section.defaultOpen || false;
  return acc;
}, {});

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      // Drawer visibility states
      drawerLeftOpen: false,
      drawerRightOpen: false,
      
      // Drawer sections collapse/expand states
      drawerSections: initialDrawerSections,
      
      // Drawer actions
      setDrawerLeftOpen: (open) => set({ drawerLeftOpen: open }),
      setDrawerRightOpen: (open) => set({ drawerRightOpen: open }),
      
      toggleDrawerLeft: () => set((state) => ({ 
        drawerLeftOpen: !state.drawerLeftOpen 
      })),
      
      toggleDrawerRight: () => set((state) => ({ 
        drawerRightOpen: !state.drawerRightOpen 
      })),
      
      closeBothDrawers: () => set({ 
        drawerLeftOpen: false, 
        drawerRightOpen: false 
      }),
      
      closeDrawerLeft: () => set({ drawerLeftOpen: false }),
      closeDrawerRight: () => set({ drawerRightOpen: false }),
      
      openDrawerLeft: () => set({ drawerLeftOpen: true }),
      openDrawerRight: () => set({ drawerRightOpen: true }),
      
      // Drawer sections management
      toggleDrawerSection: (stateKey) => set((state) => ({
        drawerSections: {
          ...state.drawerSections,
          [stateKey]: !state.drawerSections[stateKey],
        },
      })),
      
      setDrawerSection: (stateKey, isOpen) => set((state) => ({
        drawerSections: {
          ...state.drawerSections,
          [stateKey]: isOpen,
        },
      })),
      
      expandDrawerSection: (stateKey) => set((state) => ({
        drawerSections: {
          ...state.drawerSections,
          [stateKey]: true,
        },
      })),
      
      collapseDrawerSection: (stateKey) => set((state) => ({
        drawerSections: {
          ...state.drawerSections,
          [stateKey]: false,
        },
      })),
      
      expandAllSections: () => {
        const expandedSections = Object.keys(get().drawerSections).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        set({ drawerSections: expandedSections });
      },
      
      collapseAllSections: () => {
        const collapsedSections = Object.keys(get().drawerSections).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        set({ drawerSections: collapsedSections });
      },
      
      resetDrawerSections: () => set({ 
        drawerSections: initialDrawerSections 
      }),
      
      // Mobile-specific actions
      openLeftDrawerMobile: () => set({ 
        drawerLeftOpen: true, 
        drawerRightOpen: false 
      }),
      
      openRightDrawerMobile: () => set({ 
        drawerLeftOpen: false, 
        drawerRightOpen: true 
      }),
      
      // Bulk actions
      resetLayout: () => set({
        drawerLeftOpen: false,
        drawerRightOpen: false,
        drawerSections: initialDrawerSections,
      }),
    }),
    {
      name: 'layout-storage',
      version: 1,
      partialize: (state) => ({
        // Only persist these states
        drawerLeftOpen: state.drawerLeftOpen,
        drawerRightOpen: state.drawerRightOpen,
        drawerSections: state.drawerSections,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure all sections from current config exist after rehydration
        if (state) {
          const currentConfigSections = drawerConfig.reduce((acc, section) => {
            acc[section.stateKey] = section.defaultOpen || false;
            return acc;
          }, {});
          
          // Merge persisted state with current config
          state.drawerSections = {
            ...currentConfigSections,
            ...state.drawerSections,
          };
        }
      },
    }
  )
);

// Optional: Custom hooks for common patterns
export const useDrawerActions = () => {
  const {
    toggleDrawerLeft,
    toggleDrawerRight,
    closeBothDrawers,
    openLeftDrawerMobile,
    openRightDrawerMobile,
  } = useLayoutStore();
  
  return {
    toggleDrawerLeft,
    toggleDrawerRight,
    closeBothDrawers,
    openLeftDrawerMobile,
    openRightDrawerMobile,
  };
};

export const useDrawerSectionActions = () => {
  const {
    toggleDrawerSection,
    expandDrawerSection,
    collapseDrawerSection,
    expandAllSections,
    collapseAllSections,
  } = useLayoutStore();
  
  return {
    toggleDrawerSection,
    expandDrawerSection,
    collapseDrawerSection,
    expandAllSections,
    collapseAllSections,
  };
};