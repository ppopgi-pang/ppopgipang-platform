import "@/app/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "@/shared/lib/@generated/routeTree.gen";
import { queryClient } from "@/shared/lib/query-client";
import DevelopmentModal from "@/components/common/development-modal";
// import "@/features/auth/api/test-login"; // 개발 환경 테스트 로그인 헬퍼

// 개발 환경에서 mock auth 설정
if (import.meta.env.MODE === "development") {
	console.log('mock-sign-in 호출위치');

	// 콘솔에서 테스트 로그인 사용법 안내
	console.log(
		"%c💡 Tip: Use window.testLogin(memberId) for quick test login",
		"background: linear-gradient(90deg, #5A42EE, #7B68EE); color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;",
	);
}

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<DevelopmentModal />
			</QueryClientProvider>
		</StrictMode>,
	);
}
