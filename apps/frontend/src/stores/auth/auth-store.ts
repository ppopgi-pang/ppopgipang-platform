import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/auth/auth.api";
import { usersApi } from "@/api/users/users.api";

interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

interface AuthStore {
  // 상태
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  // 액션
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({ user }),

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await usersApi.getUserInfo();
          set({ user: response.data, isLoading: false });
        } catch (error) {
          console.error(error);
          set({ user: null, isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          set({ user: null });
        } catch (error) {
          console.error("Logout failed:", error);
          set({ user: null });
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true, isInitialized: true });
        try {
          const response = await usersApi.getUserInfo();
          set({ user: response.data, isLoading: false });
        } catch (error) {
          console.error(error);
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage 키
      partialize: (state) => ({ user: state.user }), // user만 persist
    },
  ),
);
