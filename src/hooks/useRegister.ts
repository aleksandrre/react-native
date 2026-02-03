import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest } from '../types';

export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async (data) => {
      await login(data.token);
    },
    onError: (error: any) => {
      Alert.alert('შეცდომა', error.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა');
    },
  });
};

