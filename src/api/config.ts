import axios from 'axios';

// export const API_BASE_URL = 'http://dev.local/wp-json/turtle-booking/v1';
export const API_BASE_URL = 'http://192.168.0.100:10004/wp-json/turtle-booking/v1';

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
  },
});

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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

