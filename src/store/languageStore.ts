import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import i18n from '../i18n';

const STORAGE_LANG_KEY = 'app_language';

interface LanguageState {
  language: 'en' | 'ka';
  setLanguage: (lang: 'en' | 'ka') => void;
  initLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    SecureStore.setItemAsync(STORAGE_LANG_KEY, lang).catch(() => {});
    set({ language: lang });
  },

  initLanguage: async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_LANG_KEY);
      const lang: 'en' | 'ka' = saved === 'ka' ? 'ka' : 'en';
      i18n.changeLanguage(lang);
      set({ language: lang });
    } catch {
      // default 'en' რჩება
    }
  },
}));
