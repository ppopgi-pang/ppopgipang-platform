export interface ApiErrorResponse {
    /**
     * HTTP 상태 코드
     * @type {number}
     * @memberof ApiErrorResponse
     */
    status?: number;
    /**
     * 에러 메시지
     * @type {string}
     * @memberof ApiErrorResponse
     */
    message?: string;
    /**
     * 비즈니스 에러 코드
     * @type {string}
     * @memberof ApiErrorResponse
     */
    code?: string;
    /**
     * 응답 데이터 (에러 시 null)
     * @type {object}
     * @memberof ApiErrorResponse
     */
    data?: object | null;
}
