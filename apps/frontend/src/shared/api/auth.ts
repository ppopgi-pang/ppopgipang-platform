import { API_V1_BASE_URL } from "../lib/api-config";

export const refreshAuthToken = async (refreshToken: string) => {
    const response = await fetch(`${API_V1_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json() as Promise<{ accessToken: string }>;
};
