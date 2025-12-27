import type { AuthInput, AuthResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

export type AdminLoginDto = AuthInput.AdminLoginDto;
export type CreateAdminDto = AuthInput.CreateAdminUserDto;
export type AdminLoginResponse = AuthResult.LoginDto;

export const adminLogin = async (data: AdminLoginDto): Promise<AdminLoginResponse> => {
    const { data: response } = await apiClient.post<AdminLoginResponse>("/auth/admin-login", data);
    return response;
};

export const createAdminUser = async (data: CreateAdminDto): Promise<void> => {
    await apiClient.post("/auth/create-admin-user", data);
};
