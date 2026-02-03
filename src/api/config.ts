import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://api.example.com'; // შეცვალე შენი API URL-ით

// publicApi: Login, Register და საჯარო მონაცემებისთვის
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// privateApi: პროფილი, კალათა და სხვა დაცული რესურსებისთვის
export const privateApi = axios.create({
  baseURL: BASE_URL,
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

