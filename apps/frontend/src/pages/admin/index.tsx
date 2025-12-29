import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import CreateStoreTypeForm from "@/features/admin/create-store-type-form";
import CreateStoreForm from "@/features/admin/create-store-form";
import CreateAdminUserForm from "@/features/admin/create-admin-user-form";
import JobPostingList from "@/features/admin/career/job-posting-list";
import CreateJobPostingForm from "@/features/admin/career/create-job-posting-form";
import EditJobPostingForm from "@/features/admin/career/edit-job-posting-form";
import ApplicationList from "@/features/admin/career/application-list";
import ApplicationDetail from "@/features/admin/career/application-detail";
import { useAuth } from "@/shared/lib/use-auth";

export const Route = createFileRoute("/admin/")({
	component: AdminPage,
});

type AdminTab = "store" | "type" | "admin-user" | "job-posting" | "application";
type ViewMode = "list" | "create" | "edit" | "detail";

function AdminPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<AdminTab>("store");
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [selectedId, setSelectedId] = useState<number | null>(null);

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
		};

		verifyAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!hasCheckedAuth || isLoading) return;

		if (!isLoggedIn) {
			navigate({ to: "/admin/login" });
			return;
		}

		if (!user?.isAdmin) {
			navigate({ to: "/" });
		}
	}, [navigate, hasCheckedAuth, isLoggedIn, isLoading, user]);

	if (!hasCheckedAuth || isLoading || !isLoggedIn || !user?.isAdmin) return null;

	const handleTabChange = (tab: AdminTab) => {
		setActiveTab(tab);
		setViewMode("list");
		setSelectedId(null);
	};

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
			<header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
						Administration
					</p>
					<h1 className="mt-2 text-3xl font-semibold text-slate-900">Platform Operations</h1>
					<p className="mt-2 text-sm text-slate-500">
						Manage stores, definitions, users, and careers.
					</p>
				</div>
				<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
					Desktop-optimized workspace • Full-width layout
				</div>
			</header>

			<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
				<aside className="flex flex-col gap-3">
					<button
						onClick={() => handleTabChange("store")}
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
						onClick={() => handleTabChange("type")}
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
						onClick={() => handleTabChange("admin-user")}
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
					<button
						onClick={() => handleTabChange("job-posting")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "job-posting"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Job Postings
						<p className="mt-1 text-xs font-normal text-slate-400">
							Manage career opportunities.
						</p>
					</button>
					<button
						onClick={() => handleTabChange("application")}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "application"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Applications
						<p className="mt-1 text-xs font-normal text-slate-400">
							View job applications.
						</p>
					</button>
				</aside>

				<div className="flex flex-col gap-6">
					{activeTab === "store" && <CreateStoreForm />}
					{activeTab === "type" && <CreateStoreTypeForm />}
					{activeTab === "admin-user" && <CreateAdminUserForm />}

					{activeTab === "job-posting" && (
						<>
							{viewMode === "list" && (
								<div className="flex flex-col gap-4">
									<div className="flex justify-end">
										<button
											onClick={() => setViewMode("create")}
											className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
										>
											채용 공고 생성
										</button>
									</div>
									<JobPostingList onEdit={(id) => {
										setSelectedId(id);
										setViewMode("edit");
									}} />
								</div>
							)}
							{viewMode === "create" && (
								<CreateJobPostingForm
									onSuccess={() => setViewMode("list")}
									onCancel={() => setViewMode("list")}
								/>
							)}
							{viewMode === "edit" && selectedId && (
								<EditJobPostingForm
									id={selectedId}
									onSuccess={() => {
										setViewMode("list");
										setSelectedId(null);
									}}
									onCancel={() => {
										setViewMode("list");
										setSelectedId(null);
									}}
								/>
							)}
						</>
					)}

					{activeTab === "application" && (
						<>
							{viewMode === "list" && (
								<ApplicationList onViewDetail={(id) => {
									setSelectedId(id);
									setViewMode("detail");
								}} />
							)}
							{viewMode === "detail" && selectedId && (
								<ApplicationDetail
									id={selectedId}
									onBack={() => {
										setViewMode("list");
										setSelectedId(null);
									}}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
