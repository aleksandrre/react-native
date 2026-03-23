import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { privateApi, setAuthToken, setOnUnauthorized } from '../api/config';

const STORAGE_TOKEN_KEY = 'auth_token';
const STORAGE_USER_KEY = 'auth_user';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  user: null,

  login: async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync(STORAGE_TOKEN_KEY, token);
      await SecureStore.setItemAsync(STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore — session მაინც გაგრძელდება
    }
    setAuthToken(token);
    set({ isAuthenticated: true, token, user });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_TOKEN_KEY);
      await SecureStore.deleteItemAsync(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    setAuthToken(null);
    set({ isAuthenticated: false, token: null, user: null });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(STORAGE_USER_KEY);
      const user: User | null = userJson ? JSON.parse(userJson) : null;

      setAuthToken(token ?? null);
      // 401-ზე logout-ი გამოიძახება config.ts-ის interceptor-ის მეშვეობით
      setOnUnauthorized(() => get().logout());

      set({
        isAuthenticated: !!token,
        token: token ?? null,
        user,
        isLoading: false,
      });
    } catch {
      setAuthToken(null);
      set({ isAuthenticated: false, token: null, user: null, isLoading: false });
    }
  },

  updateUser: async (user: User) => {
    set((state) => {
      const updated = { ...state.user, ...user } as User;
      SecureStore.setItemAsync(STORAGE_USER_KEY, JSON.stringify(updated)).catch(() => {});
      return { user: updated };
    });
  },

  refreshCredits: async () => {
    try {
      const response = await privateApi.get<{ credits: number }>('/credits');
      set((state) => ({
        user: state.user ? { ...state.user, credits: response.data.credits } : null,
      }));
    } catch {
      // silent — ძველი credits მნიშვნელობა რჩება
    }
  },
}));
