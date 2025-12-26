import {
	createRootRoute,
	Outlet,
	useLayoutEffect,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useRef } from "react";
import TanstackQueryProvider from "../providers/tanstack-query-provider";
import AdminBlockModal from "@/features/auth/admin-block-modal";
import { logout } from "@/shared/api/auth";
import { notifyAuthChange, useAuth } from "@/shared/lib/use-auth";
// import { TanstackQueryProvider } from "@/app/providers";
// import { useRefreshToken } from "@/features/auth";
// // Token check removed, handled by components/hooks

const RootLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isAdminRoute = location.pathname.startsWith("/admin");
	const entryIsAdmin = useRef(isAdminRoute);
	const { user, isLoading: isAuthLoading, isLoggedIn } = useAuth();

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
		if (entryIsAdmin.current !== isAdminRoute) {
			window.location.reload();
			return;
		}

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

	const showAdminBlockModal =
		!isAdminRoute && !isAuthLoading && isLoggedIn && user?.isAdmin;

	const handleReturnToAdmin = () => {
		window.location.href = "/admin";
	};

	const handleLogout = async () => {
		await logout();
		notifyAuthChange(null);
		navigate({ to: "/" });
	};

	return (
		<TanstackQueryProvider>
			{isAdminRoute ? (
				<div className="admin-shell">
					<div className="admin-frame">
						<Outlet />
					</div>
				</div>
			) : (
				<div className="app-shell">
					<div className="app-frame">
						<Outlet />
					</div>
				</div>
			)}
			<AdminBlockModal
				isOpen={showAdminBlockModal}
				onReturnToAdmin={handleReturnToAdmin}
				onLogout={handleLogout}
			/>
			<TanStackRouterDevtools />
		</TanstackQueryProvider>
	);
};
import { NotFoundPage } from "@/shared/ui/not-found";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: NotFoundPage,
});
