import { useTranslation } from 'react-i18next';
import { extractApiError, ApiError } from '../utils/apiError';

export const useApiError = () => {
  const { t, i18n } = useTranslation();

  const getApiError = (error: ApiError): string => {
    return extractApiError(error, i18n.language) ?? t('common.error');
  };

  return { getApiError };
};
