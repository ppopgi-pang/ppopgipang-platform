import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import TanstackQueryProvider from "../providers/tanstack-query-provider";
// import { TanstackQueryProvider } from "@/app/providers";
// import { useRefreshToken } from "@/features/auth";
// import { tokenManager } from "@/shared/api/config";

function RootLayout() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const initializeAuth = async () => {};

    initializeAuth();
  }, []);

  return (
    <TanstackQueryProvider>
      <Outlet />
    </TanstackQueryProvider>
  );
}
export const Route = createRootRoute({ component: RootLayout });
