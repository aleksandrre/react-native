import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  user: null,

  login: async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch {
      // SecureStore-ი შეიძლება fail-ს გაკეთოს web-ზე ან ზოგ მოწყობილობაზე
      // მაგრამ session-ისთვის მაინც ვლოგინდებით
    }
    set({ isAuthenticated: true, token, user });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch {
      // ignore
    }
    set({ isAuthenticated: false, token: null, user: null });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      set({
        isAuthenticated: !!token,
        token: token ?? null,
        isLoading: false,
      });
    } catch {
      set({ isAuthenticated: false, token: null, isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set((state) => ({ user: { ...state.user, ...user } }));
  },
}));
