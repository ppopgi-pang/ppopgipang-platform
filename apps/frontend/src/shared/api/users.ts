import type { UserResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";
import { API_BASE_URL } from "../lib/api-config";

type GetMyProfileOptions = {
    skipAuthModal?: boolean;
};

export const getMyProfile = async (
    options?: GetMyProfileOptions,
): Promise<UserResult.UserInfo> => {
    const { data } = await apiClient.get<UserResult.UserInfo>(`${API_BASE_URL}/v1/users`, {
        skipAuthModal: options?.skipAuthModal,
    });
    return data;
};
