import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  login: async (token: string) => {
    await SecureStore.setItemAsync('auth_token', token);
    set({ isAuthenticated: true, token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ isAuthenticated: false, token: null });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      set({
        isAuthenticated: false,
        token,
        isLoading: false,
      });
      console.log("Shemovida try ში")

    } catch (error) {
      console.log("Shemovida catch ში")
      set({ isAuthenticated: false, token: null, isLoading: false });
    }
  },
}));

