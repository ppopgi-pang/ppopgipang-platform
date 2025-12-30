import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import TanstackQueryProvider from "../providers/tanstack-query-provider";
import ToastContainer from "@/components/common/toast/toast-container";
import { useAuthStore } from "@/stores/auth/auth-store";
import { NotFoundPage } from "@/shared/ui/not-found";
// import { TanstackQueryProvider } from "@/app/providers";
// import { useRefreshToken } from "@/features/auth";
// import { tokenManager } from "@/shared/api/config";

function RootLayout() {
  const location = useLocation();
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, []);

  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.scrollTop = 0;
      root.scrollLeft = 0;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const initializeAuth = async () => {};

    initializeAuth();
  }, []);

  return (
    <TanstackQueryProvider>
      <Outlet />
      <ToastContainer />
    </TanstackQueryProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});
