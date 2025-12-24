import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CreateStoreTypeForm from "@/features/admin/create-store-type-form";
import CreateStoreForm from "@/features/admin/create-store-form";

export const Route = createFileRoute("/admin/")({
	component: AdminPage,
});

function AdminPage() {
	const [activeTab, setActiveTab] = useState<"store" | "type">("store");

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

				<div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
					<button
						onClick={() => setActiveTab("store")}
						className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
							activeTab === "store"
								? "bg-white text-indigo-600 border-b-2 border-indigo-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Create Store
					</button>
					<button
						onClick={() => setActiveTab("type")}
						className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
							activeTab === "type"
								? "bg-white text-indigo-600 border-b-2 border-indigo-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Create Store Type
					</button>
				</div>

				<div>
					{activeTab === "store" && <CreateStoreForm />}
					{activeTab === "type" && <CreateStoreTypeForm />}
				</div>
			</div>
		</div>
	);
}
