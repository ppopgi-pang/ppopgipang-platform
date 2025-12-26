import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { StoreTypeInput } from "@ppopgipang/types";
import { createStoreType } from "@/shared/api/stores";

type CreateStoreTypeFormState = StoreTypeInput.CreateStoreTypeDto;

const INITIAL_STATE: CreateStoreTypeFormState = {
	name: "",
	description: "",
};

export default function CreateStoreTypeForm() {
	const [formData, setFormData] = useState<CreateStoreTypeFormState>(INITIAL_STATE);
	const [message, setMessage] = useState("");

	const createStoreTypeMutation = useMutation({
		mutationFn: (payload: CreateStoreTypeFormState) => createStoreType(payload),
		onSuccess: () => {
			setMessage("Store Type created successfully!");
			setFormData(INITIAL_STATE);
		},
		onError: () => {
			setMessage("Failed to create Store Type.");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		createStoreTypeMutation.mutate(formData);
	};

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 className="text-lg font-bold mb-4">Create Store Type</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label className="block text-sm font-medium text-slate-600">Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-slate-600">Description</label>
					<input
						type="text"
						name="description"
						value={formData.description ?? ""}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
					/>
				</div>
				<button
					type="submit"
					disabled={createStoreTypeMutation.isPending}
					className="inline-flex justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					{createStoreTypeMutation.isPending ? "Creating..." : "Create"}
				</button>
				{message && <p className="text-sm text-center mt-2">{message}</p>}
			</form>
		</div>
	);
}
