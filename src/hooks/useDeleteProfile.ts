import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useDeleteProfile = () => {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authApi.deleteProfile(),
    onSuccess: () => {
      logout();
    },
  });
};
