import axios from 'axios';

// export const API_BASE_URL = 'http://dev.local:10004/wp-json/turtle-booking/v1';
export const API_BASE_URL = 'http://192.168.0.101:10004/wp-json/turtle-booking/v1';
// export const API_BASE_URL = 'https://ca0e-46-49-71-80.ngrok-free.app/wp-json/turtle-booking/v1';
// Module-level ცვლადები — circular dependency-ს გარეშე
let _token: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  _token = token;
};

export const setOnUnauthorized = (cb: () => void) => {
  _onUnauthorized = cb;
};

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'ngrok-skip-browser-warning': 'true', // <-- აი ეს დაამატე
  },
});

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'ngrok-skip-browser-warning': 'true', // <-- აი ეს დაამატე
  },
});

privateApi.interceptors.request.use(
  (config) => {
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      _onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

