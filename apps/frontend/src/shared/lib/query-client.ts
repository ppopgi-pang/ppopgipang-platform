import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/shared/api/api-error-response';

// API 에러 타입 확인 헬퍼
const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error && error.isAxiosError === true;
};

// 에러 분류 헬퍼
const classifyError = (error: unknown) => {
    if (!isApiError(error)) {
        return {
            type: 'UNKNOWN',
            message: '알 수 없는 오류가 발생했습니다',
            canRetry: true,
        };
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;
    const errorMessage = error.response?.data?.message;

    // 401: 인증 오류 - 재시도 불가
    if (status === 401) {
        return {
            type: 'AUTH',
            message: '로그인이 필요합니다',
            canRetry: false,
        };
    }

    // 403: 권한 오류 - 재시도 불가
    if (status === 403) {
        return {
            type: 'PERMISSION',
            message: '접근 권한이 없습니다',
            canRetry: false,
        };
    }

    // 404: 리소스 없음 - 재시도 불가
    if (status === 404) {
        return {
            type: 'NOT_FOUND',
            message: '요청한 정보를 찾을 수 없습니다',
            canRetry: false,
        };
    }

    // 422: 검증 오류 - 재시도 불가
    if (status === 422) {
        return {
            type: 'VALIDATION',
            message: errorMessage || '입력값을 확인해주세요',
            canRetry: false,
        };
    }

    // 429: Rate Limit - 재시도 가능
    if (status === 429) {
        return {
            type: 'RATE_LIMIT',
            message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요',
            canRetry: true,
            retryAfter: error.response?.headers?.['retry-after'],
        };
    }

    // 500번대: 서버 오류 - 재시도 가능
    if (status && status >= 500) {
        return {
            type: 'SERVER',
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
            canRetry: true,
        };
    }

    // 네트워크 오류 - 재시도 가능
    if (error.code === 'ERR_NETWORK') {
        return {
            type: 'NETWORK',
            message: '네트워크 연결을 확인해주세요',
            canRetry: true,
        };
    }

    // 타임아웃 - 재시도 가능
    if (error.code === 'ECONNABORTED') {
        return {
            type: 'TIMEOUT',
            message: '요청 시간이 초과되었습니다',
            canRetry: true,
        };
    }

    // 기본값
    return {
        type: 'UNKNOWN',
        message: errorMessage || error.message || '오류가 발생했습니다',
        canRetry: true,
    };
};

// 글로벌 에러 핸들러
const handleError = (error: unknown) => {
    const classifiedError = classifyError(error);

    // 개발 환경에서는 콘솔에 자세한 정보 출력
    if (import.meta.env.MODE === 'development') {
        console.error('Query Error:', {
            error,
            classification: classifiedError,
        });
    }

    // 에러 타입별 처리
    switch (classifiedError.type) {
        case 'AUTH':
            // 인증 오류 - 로그인 페이지로 리다이렉트
            // Router를 사용할 수 없는 경우 window.location 사용
            if (window.location.pathname !== '/riot') {
                // 현재 위치를 저장하여 로그인 후 돌아올 수 있도록 함
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = '/riot';
            }
            break;

        case 'PERMISSION':
        case 'NOT_FOUND':
            // 권한/404 오류는 Error Boundary에서 처리하도록 throw
            throw error;

        case 'NETWORK':
        case 'TIMEOUT':
        case 'SERVER':
            // 네트워크/서버 오류는 사용자에게 알림
            // Toast 시스템이 있다면 여기서 호출
            console.warn(classifiedError.message);
            break;

        default:
            // 기타 오류
            console.error(classifiedError.message);
    }
};

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 기본 재시도 횟수 (네트워크 오류시)
            retry: (failureCount, error) => {
                // 최대 3회까지 재시도
                if (failureCount >= 3) return false;

                // 에러 분류에 따라 재시도 여부 결정
                const classified = classifyError(error);
                return classified.canRetry;
            },

            // 재시도 딜레이 (지수 백오프)
            retryDelay: (attemptIndex, error) => {
                const classified = classifyError(error);

                // Rate Limit의 경우 서버가 알려준 시간만큼 대기
                if (classified.type === 'RATE_LIMIT' && classified.retryAfter) {
                    return Number.parseInt(classified.retryAfter) * 1000;
                }

                // 기본: 지수 백오프 (1초, 2초, 4초...)
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },

            // 기본 stale 시간
            staleTime: 1000 * 60, // 1분

            // 기본 캐시 시간
            gcTime: 1000 * 60 * 5, // 5분

            // 윈도우 포커스시 자동 refetch 비활성화
            // (필요한 경우 개별 쿼리에서 활성화)
            refetchOnWindowFocus: false,

            // 마운트시 자동 refetch 비활성화
            // (필요한 경우 개별 쿼리에서 활성화)
            refetchOnMount: true,

            // 재연결시 자동 refetch
            refetchOnReconnect: 'always',

            // 글로벌 에러 핸들러
            throwOnError: (error) => {
                // 에러 분류
                const classified = classifyError(error);

                // Error Boundary로 전파할 에러 타입
                return ['PERMISSION', 'NOT_FOUND'].includes(classified.type);
            },
        },

        mutations: {
            // mutation 재시도는 기본적으로 비활성화
            retry: false,

            // mutation 에러 핸들러
            onError: (error) => {
                handleError(error);
            },
        },
    },
});

// 타입 export
export type { ApiErrorResponse };
export { classifyError, isApiError };
