import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { LoginRequest } from '../types';

export const useLogin = () => {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (data) => {
      await login(data.token, data.user);
    },
    onError: (error: any) => {
      Alert.alert(t('common.error'), error.response?.data?.message || 'ავტორიზაცია ვერ მოხერხდა');
    },
  });
};
