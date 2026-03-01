import { useMemo } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { enUS } from 'date-fns/locale/en-US';
import { ka } from 'date-fns/locale/ka';
import type { Locale } from 'date-fns';

const localeMap: Record<'en' | 'ka', Locale> = {
  en: enUS,
  ka,
};

/**
 * Returns the date-fns locale for the current app language (en or ka).
 * Use with format(): format(date, 'MMM yyyy', { locale: dateLocale })
 */
export function useDateLocale(): Locale {
  const { language } = useLanguageStore();
  return useMemo(() => localeMap[language] ?? enUS, [language]);
}
