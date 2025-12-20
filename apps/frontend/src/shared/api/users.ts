import type { UserResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

export const getMyProfile = async (): Promise<UserResult.UserInfo> => {
    const { data } = await apiClient.get<UserResult.UserInfo>("http://localhost:3000/api/users");
    return data;
};
