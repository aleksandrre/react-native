import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { LoginRequest } from '../types';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (data) => {
      await login(data.token);
    },
    onError: (error: any) => {
      Alert.alert('შეცდომა', error.response?.data?.message || 'ავტორიზაცია ვერ მოხერხდა');
    },
  });
};

