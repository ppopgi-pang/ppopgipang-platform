import axios from "axios";
import { tokenManager } from "./token-manager";
import { openLoginModal } from "./auth-modal";
import { refreshAuthToken } from "../api/auth";
import { API_V1_BASE_URL } from "./api-config";

export const apiClient = axios.create({
    baseURL: API_V1_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Access Token 주입
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: 401 처리 및 토큰 재발급
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                tokenManager.removeTokens();
                openLoginModal();
                return Promise.reject(error);
            }

            try {
                const { accessToken } = await refreshAuthToken(refreshToken);
                tokenManager.setAccessToken(accessToken);

                // 새로운 토큰으로 헤더 업데이트 및 재요청
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 로그아웃 처리
                tokenManager.removeTokens();
                openLoginModal();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
