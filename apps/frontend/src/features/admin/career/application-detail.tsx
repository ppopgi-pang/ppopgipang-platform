import { useQuery } from "@tanstack/react-query";
import { getApplication } from "@/shared/api/careers";

import { TEMP_IMAGE_BASE_URL } from "@/shared/lib/api-config";

interface ApplicationDetailProps {
    id: number;
    onBack: () => void;
}

export default function ApplicationDetail({ id, onBack }: ApplicationDetailProps) {
    const { data: application, isLoading } = useQuery({
        queryKey: ["admin-application", id],
        queryFn: () => getApplication(id),
    });

    if (isLoading) return <div>Loading...</div>;
    if (!application) return <div>Application not found</div>;

    const downloadUrl = application.resumeName ? `${TEMP_IMAGE_BASE_URL}${application.resumeName}` : null;
    const fileName = application.resumeName;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">지원서 상세 정보</h2>
                <button
                    onClick={onBack}
                    className="text-sm text-slate-500 hover:text-slate-700"
                >
                    목록으로 돌아가기
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-slate-500">지원한 공고</h3>
                    <p className="mt-1 text-base text-slate-900">{application.jobPosting.title}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">이름</h3>
                        <p className="mt-1 text-base text-slate-900">{application.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">이메일</h3>
                        <p className="mt-1 text-base text-slate-900">{application.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">전화번호</h3>
                        <p className="mt-1 text-base text-slate-900">{application.phone || "-"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">상태</h3>
                        <p className="mt-1 text-base text-slate-900">{application.status}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-slate-500">이력서/포트폴리오 파일</h3>
                    <div className="mt-1 flex items-center gap-4">
                        <p className="text-base text-slate-900">{fileName || "제출된 파일 없음"}</p>
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1.5 h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                다운로드
                            </a>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-slate-500">메모/자기소개</h3>
                    <div className="mt-1 rounded-md bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                        {application.memo || "내용 없음"}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
                    제출일: {new Date(application.createdAt).toLocaleString()}
                </div>
            </div>
        </div>
    );
}
