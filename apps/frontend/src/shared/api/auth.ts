export const refreshAuthToken = async (refreshToken: string) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/refresh", {
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
