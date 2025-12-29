import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getJobPostings, deleteJobPosting } from "@/shared/api/careers";
import type { CareerResult } from "@ppopgipang/types";

interface JobPostingListProps {
    onEdit: (id: number) => void;
}

export default function JobPostingList({ onEdit }: JobPostingListProps) {
    const [page] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-job-postings", page],
        queryFn: () => getJobPostings({ page, size: 20 }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJobPosting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-job-postings"] });
            alert("삭제되었습니다.");
        },
        onError: () => {
            alert("삭제에 실패했습니다.");
        },
    });

    const handleDelete = (id: number) => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">모집 공고 목록</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">제목</th>
                            <th className="px-4 py-3">부서</th>
                            <th className="px-4 py-3">상태</th>
                            <th className="px-4 py-3">등록일</th>
                            <th className="px-4 py-3">지원자 수</th>
                            <th className="px-4 py-3">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data?.items.map((item: CareerResult.JobPostingDto) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{item.id}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                                <td className="px-4 py-3">{item.department}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        {item.isActive ? "진행중" : "마감"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">{item.applicationCount ?? 0}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onEdit(item.id)}
                                        className="mr-2 text-blue-600 hover:text-blue-800"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!data?.items.length && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                    등록된 모집 공고가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination could be added here using data.total */}
        </div>
    );
}
