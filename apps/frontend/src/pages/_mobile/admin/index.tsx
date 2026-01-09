import "@/app/styles/admin.css";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import CreateStoreTypeForm from "@/features/admin/create-store-type-form";
import StoreForm from "@/features/admin/store-form";
import CreateAdminUserForm from "@/features/admin/create-admin-user-form";
import EditStoreContainer from "@/features/admin/edit-store-container";
import CreateJobPostingForm from "@/features/admin/career/create-job-posting-form";
import EditJobPostingForm from "@/features/admin/career/edit-job-posting-form";
import JobPostingList from "@/features/admin/career/job-posting-list";
import ApplicationList from "@/features/admin/career/application-list";
import ApplicationDetail from "@/features/admin/career/application-detail";
import { useAuth } from "@/shared/lib/use-auth";

export const Route = createFileRoute("/_mobile/admin/")({
	component: AdminPage,
});

function AdminPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<
		| "store"
		| "store-edit"
		| "type"
		| "admin-user"
		| "career-list"
		| "career-create"
		| "career-edit"
		| "applications"
		| "application-detail"
	>("store");
	const [editingJobPostingId, setEditingJobPostingId] = useState<number | null>(null);
	const [applicationDetailId, setApplicationDetailId] = useState<number | null>(null);
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
					<h1 className="mt-2 text-3xl font-semibold text-slate-900">Operations Console</h1>
					<p className="mt-2 text-sm text-slate-500">
						Manage stores, career postings, applicants, and admin accounts from one workspace.
					</p>
				</div>
				<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
					Desktop-optimized workspace • Full-width layout
				</div>
			</header>

			<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
				<aside className="flex flex-col gap-3">
					<button
						onClick={() => {
							setActiveTab("store");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
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
						onClick={() => {
							setActiveTab("store-edit");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
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
						onClick={() => {
							setActiveTab("type");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
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
						onClick={() => {
							setActiveTab("admin-user");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
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
						onClick={() => {
							setActiveTab("career-list");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "career-list" || activeTab === "career-edit"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Job Postings
						<p className="mt-1 text-xs font-normal text-slate-400">
							Review and manage active listings.
						</p>
					</button>
					<button
						onClick={() => {
							setActiveTab("career-create");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "career-create"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Create Job Posting
						<p className="mt-1 text-xs font-normal text-slate-400">
							Publish a new recruitment role.
						</p>
					</button>
					<button
						onClick={() => {
							setActiveTab("applications");
							setEditingJobPostingId(null);
							setApplicationDetailId(null);
						}}
						className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeTab === "applications" || activeTab === "application-detail"
							? "border-slate-300 bg-white text-slate-900 shadow-sm"
							: "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
							}`}
					>
						Applicants
						<p className="mt-1 text-xs font-normal text-slate-400">
							View and review submitted applications.
						</p>
					</button>
				</aside>

				<div className="flex flex-col gap-6">
					{activeTab === "store" && <StoreForm mode="create" />}
					{activeTab === "store-edit" && <EditStoreContainer />}
					{activeTab === "type" && <CreateStoreTypeForm />}
					{activeTab === "admin-user" && <CreateAdminUserForm />}
					{activeTab === "career-list" && (
						<JobPostingList
							onEdit={(id) => {
								setEditingJobPostingId(id);
								setActiveTab("career-edit");
							}}
						/>
					)}
					{activeTab === "career-create" && (
						<CreateJobPostingForm
							onSuccess={() => {
								setEditingJobPostingId(null);
								setActiveTab("career-list");
							}}
							onCancel={() => {
								setEditingJobPostingId(null);
								setActiveTab("career-list");
							}}
						/>
					)}
					{activeTab === "career-edit" && editingJobPostingId !== null && (
						<EditJobPostingForm
							id={editingJobPostingId}
							onSuccess={() => {
								setEditingJobPostingId(null);
								setActiveTab("career-list");
							}}
							onCancel={() => {
								setEditingJobPostingId(null);
								setActiveTab("career-list");
							}}
						/>
					)}
					{activeTab === "applications" && (
						<ApplicationList
							onViewDetail={(id) => {
								setApplicationDetailId(id);
								setActiveTab("application-detail");
							}}
						/>
					)}
					{activeTab === "application-detail" && applicationDetailId !== null && (
						<ApplicationDetail
							id={applicationDetailId}
							onBack={() => {
								setApplicationDetailId(null);
								setActiveTab("applications");
							}}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
