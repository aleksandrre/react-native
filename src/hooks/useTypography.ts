import { useLanguageStore } from '../store/languageStore';
import { enTypography, kaTypography } from '../theme/typography';

export const useTypography = () => {
  const language = useLanguageStore((s) => s.language);
  return language === 'ka' ? kaTypography : enTypography;
};
