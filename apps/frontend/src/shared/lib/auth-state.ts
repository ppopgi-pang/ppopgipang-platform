import type { UserResult } from "@ppopgipang/types";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

const AUTH_USER_KEY = "ppopgipang:auth-user";

export const readAuthUser = (): UserResult.UserInfo | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as UserResult.UserInfo;
    } catch {
        return null;
    }
};

export const writeAuthUser = (user: UserResult.UserInfo | null) => {
    if (typeof window === "undefined") return;
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return;
    }
    localStorage.removeItem(AUTH_USER_KEY);
};

export const hasAuthUser = () => Boolean(readAuthUser());
