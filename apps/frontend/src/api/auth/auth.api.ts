import { api } from "../common/client";

export const authApi = {
  logout: () => api.post("/api/v1/auth/logout"),
  refreshToken: () => api.post("/api/v1/auth/refresh"),
};
