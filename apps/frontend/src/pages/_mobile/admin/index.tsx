import "@/app/styles/admin.css";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import CreateStoreTypeForm from "@/features/admin/create-store-type-form";
import StoreForm from "@/features/admin/store-form";
import CreateAdminUserForm from "@/features/admin/create-admin-user-form";
import EditStoreContainer from "@/features/admin/edit-store-container";
import { useAuth } from "@/shared/lib/use-auth";

export const Route = createFileRoute("/_mobile/admin/")({
	component: AdminPage,
});

function AdminPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"store" | "store-edit" | "type" | "admin-user">("store");
	const { isLoggedIn, isLoading, user, checkAuth } = useAuth();
	const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
	const hasRequestedCheck = useRef(false);

	useEffect(() => {
		if (hasRequestedCheck.current) return;
		hasRequestedCheck.current = true;

		const verifyAuth = async () => {
			try {
				await checkAuth();
			} finally {
				setHasCheckedAuth(true);
			}
		}

		verifyAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!hasCheckedAuth || isLoading) return;

		if (!isLoggedIn) {
			navigate({ to: "/admin/login" });
			return
		}

		if (!user?.isAdmin) {
			navigate({ to: "/" });
		}
	}, [navigate, hasCheckedAuth, isLoggedIn, isLoading, user]);

	if (!hasCheckedAuth || isLoading || !isLoggedIn || !user?.isAdmin) return null; // or loading spinner

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
			<header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
						Administration
					</p>
					<h1 className="mt-2 text-3xl font-semibold text-slate-900">Store Operations</h1>
					<p className="mt-2 text-sm text-slate-500">
						Manage store entries and categorize new locations for the platform.
					</p>
				</div>
				<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
					Desktop-optimized workspace • Full-width layout
				</div>
			</header>

			<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
				<aside className="flex flex-col gap-3">
					<button
						onClick={() => setActiveTab("store")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "store"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Create Store
						<p className="mt-1 text-xs font-normal text-slate-400">
							Add a new store with map coordinates.
						</p>
					</button>
					<button
						onClick={() => setActiveTab("store-edit")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "store-edit"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Edit Store
						<p className="mt-1 text-xs font-normal text-slate-400">
							Search and update existing stores.
						</p>
					</button>
					<button
						onClick={() => setActiveTab("type")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "type"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Create Store Type
						<p className="mt-1 text-xs font-normal text-slate-400">
							Define categories that appear in the app.
						</p>
					</button>
					<button
						onClick={() => setActiveTab("admin-user")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "admin-user"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Create Admin User
						<p className="mt-1 text-xs font-normal text-slate-400">
							Create a new admin account.
						</p>
					</button>
				</aside>

				<div className="flex flex-col gap-6">
					{activeTab === "store" && <StoreForm mode="create" />}
					{activeTab === "store-edit" && <EditStoreContainer />}
					{activeTab === "type" && <CreateStoreTypeForm />}
					{activeTab === "admin-user" && <CreateAdminUserForm />}
				</div>
			</div>
		</div>
	)
}
