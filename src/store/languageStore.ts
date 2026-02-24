import { create } from 'zustand';
import i18n from '../i18n';

interface LanguageState {
  language: 'en' | 'ka';
  setLanguage: (lang: 'en' | 'ka') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
}));
