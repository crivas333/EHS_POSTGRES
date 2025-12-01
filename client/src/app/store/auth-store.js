//src/app/store/auth-store.js 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuth: false,
      isLoading: true,
      user: null,
      token: null,
      
      login: (userData, token) => {
        localStorage.setItem('authToken', token);
        set({ 
          isAuth: true, 
          user: userData, 
          token,
          isLoading: false 
        });
      },
      
      logout: () => {
        localStorage.removeItem('authToken');
        set({ 
          isAuth: false, 
          user: null, 
          token: null,
          isLoading: false 
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Initialize auth state
      initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        set({ 
          isAuth: !!token, 
          token,
          isLoading: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuth: state.isAuth,
        user: state.user,
        token: state.token,
      }),
    }
  )
);