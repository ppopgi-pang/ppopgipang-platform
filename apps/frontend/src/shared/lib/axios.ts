import axios from "axios";
import { openLoginModal } from "./auth-modal";
import { refreshAuthToken, logout } from "../api/auth";
import { API_V1_BASE_URL } from "./api-config";
import { AUTH_QUERY_KEY, hasAuthUser, writeAuthUser } from "./auth-state";
import { queryClient } from "./query-client";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuthModal?: boolean;
    }
}

export const apiClient = axios.create({
    baseURL: API_V1_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request Interceptor: Access Token 주입 (쿠키 사용으로 제거, 디버깅용 로그만 남김 or remove entire interceptor if not needed)
// 쿠키는 브라우저가 자동으로 보냄.
apiClient.interceptors.request.use(
    (config) => {
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
        const shouldSkipAuthModal = Boolean(originalRequest?.skipAuthModal);

        if (error.response?.status === 401 && !originalRequest?._retry) {
            if (!hasAuthUser()) {
                return Promise.reject(error);
            }

            if (!originalRequest) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // 쿠키 기반 refresh 요청 (인자 없음)
                await refreshAuthToken();

                // 재발급 성공 시 재요청 (Authorization 헤더 불필요)
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 로그아웃 처리
                writeAuthUser(null);
                queryClient.setQueryData(AUTH_QUERY_KEY, null);
                if (!shouldSkipAuthModal) {
                    await logout();
                    openLoginModal();
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
