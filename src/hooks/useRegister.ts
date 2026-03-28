import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest } from '../types';
import { useApiError } from './useApiError';

export const useRegister = () => {
  const { t } = useTranslation();
  const { getApiError } = useApiError();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async (data, variables) => {
      const user = data.user ?? {
        id: 0,
        username: variables.username,
        email: variables.email,
        display_name: variables.username,
        credits: 0,
        phone: variables.phone,
      };
      await login(data.token, user);
    },
    onError: (error: any) => {
      Alert.alert(t('common.error'), getApiError(error));
    },
  });
};
