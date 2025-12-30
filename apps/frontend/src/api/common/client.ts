import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const DEFAULT_API_ORIGIN = import.meta.env.PROD
  ? "https://ppopgi.me"
  : "https://ppopgi.me";
//   : "http://localhost:3000";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || DEFAULT_API_ORIGIN;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_ORIGIN,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cookie 기반 인증을 위해 필수
});

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
};

export default api;
