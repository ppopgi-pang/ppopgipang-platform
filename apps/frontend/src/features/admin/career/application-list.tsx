import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getApplications } from "@/shared/api/careers";
import type { CareerResult } from "@ppopgipang/types";

interface ApplicationListProps {
    onViewDetail: (id: number) => void;
}

export default function ApplicationList({ onViewDetail }: ApplicationListProps) {
    const [page] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-applications", page],
        queryFn: () => getApplications({ page, size: 20 }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">지원서 목록</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">지원자</th>
                            <th className="px-4 py-3">모집 공고</th>
                            <th className="px-4 py-3">상태</th>
                            <th className="px-4 py-3">제출일</th>
                            <th className="px-4 py-3">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data?.items.map((item: CareerResult.ApplicationDto) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{item.id}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">
                                    {item.name}
                                    <div className="text-xs text-slate-400">{item.email}</div>
                                </td>
                                <td className="px-4 py-3">{item.jobPosting.title}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onViewDetail(item.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!data?.items.length && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    제출된 지원서가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination could be added here */}
        </div>
    );
}
