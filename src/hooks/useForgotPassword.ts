import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { ForgotPasswordRequest } from '../types';

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
  });
