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
		<div className="p-4 border rounded shadow bg-white">
			<h2 className="text-lg font-bold mb-4">Create Store Type</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Description</label>
					<input
						type="text"
						name="description"
						value={formData.description ?? ""}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
					/>
				</div>
				<button
					type="submit"
					disabled={createStoreTypeMutation.isPending}
					className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{createStoreTypeMutation.isPending ? "Creating..." : "Create"}
				</button>
				{message && <p className="text-sm text-center mt-2">{message}</p>}
			</form>
		</div>
	);
}
