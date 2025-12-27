import { Link } from "@tanstack/react-router";

export const NotFoundPage = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
			<div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">404</p>
				<h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
				<p className="mt-3 text-sm text-slate-500">
					The page you are looking for might have moved or no longer exists.
				</p>
				<Link
					to="/"
					className="mt-7 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:no-underline"
				>
					Back to home
				</Link>
			</div>
		</div>
	);
};
