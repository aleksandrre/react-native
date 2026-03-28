import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest } from '../types';

export const useRegister = () => {
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
  });
};
