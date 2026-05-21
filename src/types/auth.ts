import { User } from './user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  email: string;
  display_name: string;
  phone: string;
}

export interface ForgotPasswordRequest {
  user_login: string;
}

export interface LocalizedApiMessage {
  ka: string;
  en: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: LocalizedApiMessage;
}

