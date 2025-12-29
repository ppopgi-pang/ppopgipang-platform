import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CareerInput } from "@ppopgipang/types";
import { getJobPosting, updateJobPosting } from "@/shared/api/careers";

interface EditJobPostingFormProps {
    id: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditJobPostingForm({ id, onSuccess, onCancel }: EditJobPostingFormProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CareerInput.UpdateJobPostingDto>({
        title: "",
        description: "",
        department: "",
        positionType: "",
        location: "",
        isActive: true,
    });

    const { data: jobPosting, isLoading } = useQuery({
        queryKey: ["admin-job-posting", id],
        queryFn: () => getJobPosting(id),
    });

    useEffect(() => {
        if (jobPosting) {
            setFormData({
                title: jobPosting.title,
                description: jobPosting.description,
                department: jobPosting.department,
                positionType: jobPosting.positionType,
                location: jobPosting.location,
                isActive: jobPosting.isActive,
            });
        }
    }, [jobPosting]);

    const updateMutation = useMutation({
        mutationFn: (data: CareerInput.UpdateJobPostingDto) => updateJobPosting(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-job-postings"] });
            queryClient.invalidateQueries({ queryKey: ["admin-job-posting", id] });
            alert("수정되었습니다.");
            onSuccess();
        },
        onError: () => {
            alert("수정에 실패했습니다.");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CareerInput.UpdateJobPostingDto) => ({
            ...prev,
            [name]: name === "isActive" ? value === "true" : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">채용 공고 수정</h2>
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
                    <label className="block text-sm font-medium text-slate-600">활성 상태</label>
                    <select
                        name="isActive"
                        value={String(formData.isActive)}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    >
                        <option value="true">진행중</option>
                        <option value="false">마감</option>
                    </select>
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
                        disabled={updateMutation.isPending}
                        className="rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-300"
                    >
                        {updateMutation.isPending ? "수정 중..." : "수정"}
                    </button>
                </div>
            </form>
        </div>
    );
}
