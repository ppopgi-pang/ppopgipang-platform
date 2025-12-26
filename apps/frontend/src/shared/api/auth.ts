import { API_V1_BASE_URL } from "../lib/api-config";

export const refreshAuthToken = async () => {
    // 쿠키를 포함하여 요청 (credentials: 'include')
    const response = await fetch(`${API_V1_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
        },
        credentials: "include", // 쿠키 전송
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    // accessToken은 쿠키로 설정되므로 본문에서 반환받을 필요 없음 (하지만 백엔드가 success 메시지 보냄)
    return response.json();
};

export const logout = async () => {
    const response = await fetch(`${API_V1_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        console.error("Logout failed");
    }
};
