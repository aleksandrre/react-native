import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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

// ავტომატურად დაამატებს ტოკენს privateApi-ს რექვესტებს
privateApi.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
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
  async (error) => {
    if (error.response?.status === 401) {
      // ტოკენი არავალიდურია, წაშალეთ
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

