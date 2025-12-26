import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AuthInput } from "@ppopgipang/types";
import { createAdminUser } from "@/shared/api/admin";

type CreateAdminUserFormState = AuthInput.CreateAdminUserDto;

const INITIAL_STATE: CreateAdminUserFormState = {
    email: "",
    nickname: "",
    password: "",
};

export default function CreateAdminUserForm() {
    const [formData, setFormData] = useState<CreateAdminUserFormState>(INITIAL_STATE);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const createAdminUserMutation = useMutation({
        mutationFn: (payload: CreateAdminUserFormState) => createAdminUser(payload),
        onSuccess: () => {
            setMessage("Admin user created successfully!");
            setIsSuccess(true);
            setFormData(INITIAL_STATE);
            setTimeout(() => {
                setMessage("");
                setIsSuccess(false);
            }, 3000);
        },
        onError: (error: any) => {
            console.error(error);
            setMessage("Failed to create Admin user. Please check if email is unique.");
            setIsSuccess(false);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CreateAdminUserFormState) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        createAdminUserMutation.mutate(formData);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Create Admin User</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        required
                        placeholder="newadmin@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        required
                        placeholder="Admin Nickname"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        required
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
                <button
                    type="submit"
                    disabled={createAdminUserMutation.isPending}
                    className="inline-flex justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {createAdminUserMutation.isPending ? "Creating..." : "Create Admin User"}
                </button>
                {message && (
                    <p className={`text-sm text-center mt-2 ${isSuccess ? "text-emerald-600" : "text-rose-600"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
