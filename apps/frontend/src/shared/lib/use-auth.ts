import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { UserResult } from "@ppopgipang/types";
import { getMyProfile } from "../api/users";
import { queryClient } from "./query-client";
import { AUTH_QUERY_KEY, hasAuthUser, readAuthUser, writeAuthUser } from "./auth-state";

const fetchMyProfile = async (): Promise<UserResult.UserInfo | null> => {
    if (!hasAuthUser()) return null;

    try {
        const user = await getMyProfile({ skipAuthModal: true });
        writeAuthUser(user);
        return user;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            writeAuthUser(null);
        }
        return null;
    }
};

export const notifyAuthChange = (user?: UserResult.UserInfo | null) => {
    if (typeof user !== "undefined") {
        writeAuthUser(user);
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        return;
    }
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
};

export const useAuth = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: fetchMyProfile,
        initialData: readAuthUser() ?? null,
        enabled: false,
        retry: false,
        staleTime: 1000 * 60,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const user = data ?? null;
    const isLoggedIn = Boolean(user);
    const isLoadingAuth = isLoading || isFetching;

    return { user, isLoading: isLoadingAuth, isLoggedIn, checkAuth: refetch };
};
