import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CareerInput } from "@ppopgipang/types";
import { createJobPosting } from "@/shared/api/careers";

interface CreateJobPostingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreateJobPostingForm({ onSuccess, onCancel }: CreateJobPostingFormProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CareerInput.CreateJobPostingDto>({
        title: "",
        description: "",
        department: "",
        positionType: "",
        location: "",
    });

    const createMutation = useMutation({
        mutationFn: createJobPosting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-job-postings"] });
            alert("채용 공고가 생성되었습니다.");
            onSuccess();
        },
        onError: () => {
            alert("생성에 실패했습니다.");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CareerInput.CreateJobPostingDto) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">채용 공고 생성</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600">제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">부서</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">직무 유형</label>
                    <input
                        type="text"
                        name="positionType"
                        value={formData.positionType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        placeholder="예: 정규직, 계약직"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">근무지</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">상세 설명</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={10}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-300"
                    >
                        {createMutation.isPending ? "생성 중..." : "생성"}
                    </button>
                </div>
            </form>
        </div>
    );
}
