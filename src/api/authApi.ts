import { publicApi, privateApi } from './config';
import { LoginRequest, RegisterRequest, AuthResponse, UpdateProfileRequest } from '../types';
import { User } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await publicApi.post<AuthResponse>('/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await publicApi.post<AuthResponse>('/user-signup', data);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await privateApi.post<User>('/user/profile', data);
    return response.data;
  },

  getCredits: async (): Promise<number> => {
    const response = await privateApi.get<{ credits: number }>('/credits');
    return response.data.credits;
  },
};
