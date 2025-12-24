import type { UserResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";
import { API_BASE_URL } from "../lib/api-config";

export const getMyProfile = async (): Promise<UserResult.UserInfo> => {
    const { data } = await apiClient.get<UserResult.UserInfo>(`${API_BASE_URL}/users`);
    return data;
};
