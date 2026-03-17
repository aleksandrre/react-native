import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const API_BASE_URL = 'http://dev.local/wp-json/turtle-booking/v1';
// export const API_BASE_URL = 'http://192.168.0.105:8081/wp-json/turtle-booking/v1';

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ტოკენს იღებს Zustand store-დან (SecureStore-ს ნაცვლად, რომელიც web-ზე არ მუშაობს)
privateApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// რესფონსის ინტერსეპტორი - 401 შეცდომის შემთხვევაში
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

