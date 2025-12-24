import {
	createRootRoute,
	Outlet,
	useLayoutEffect,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import TanstackQueryProvider from "../providers/tanstack-query-provider";
// import { TanstackQueryProvider } from "@/app/providers";
// import { useRefreshToken } from "@/features/auth";
// import { tokenManager } from "@/shared/api/config";

const RootLayout = () => {
	const location = useLocation();

	useLayoutEffect(() => {
		const root = document.getElementById("root");
		if (root) {
			root.scrollTop = 0;
			root.scrollLeft = 0;
			return;
		}
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [location.pathname]);

	// const refreshTokenMutation = useRefreshToken();

	useEffect(() => {
		const initializeAuth = async () => {
			// const accessToken = tokenManager.getAccessToken();
			// const refreshToken = tokenManager.getRefreshToken();

			// if (!accessToken && refreshToken) {
			// 	try {
			// 		await refreshTokenMutation.mutateAsync(refreshToken);
			// 	} catch (error) {
			// 		console.warn("Token refresh error on app initialization:", error);
			// 	}
			// }
		};

		initializeAuth();
	}, []);

	return (
		<TanstackQueryProvider>
			<div className="app-shell">
				<div className="app-frame">
					<Outlet />
				</div>
			</div>
			<TanStackRouterDevtools />
		</TanstackQueryProvider>
	);
};
import { NotFoundPage } from "@/shared/ui/not-found";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: NotFoundPage,
});
