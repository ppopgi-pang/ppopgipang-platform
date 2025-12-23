import type { ReactNode } from "react";

interface LoginRequiredCardProps {
    title?: string;
    description?: string;
    backLabel?: string;
    onBack?: () => void;
    action?: ReactNode;
}

export default function LoginRequiredCard({
    title = "로그인이 필요합니다.",
    description = "이 기능을 이용하려면 로그인해주세요.",
    backLabel = "돌아가기",
    onBack,
    action,
}: LoginRequiredCardProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/90 p-6 text-center shadow-lg">
                <div className="text-lg font-bold text-slate-800">{title}</div>
                <p className="text-sm text-slate-500">{description}</p>
                {(onBack || action) && (
                    <div className="flex w-full gap-2">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                            >
                                {backLabel}
                            </button>
                        )}
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
