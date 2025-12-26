import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { adminLogin } from "@/shared/api/admin";
import { getMyProfile } from "@/shared/api/users";
import { notifyAuthChange } from "@/shared/lib/use-auth";
import type { AuthInput } from "@ppopgipang/types";

export const Route = createFileRoute("/admin/login")({
    component: AdminLoginPage,
});

function AdminLoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AuthInput.AdminLoginDto>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await adminLogin(formData);
            const user = await getMyProfile();
            // 쿠키가 설정되었으므로 글로벌 상태 업데이트 알림
            notifyAuthChange(user);

            navigate({ to: "/admin" });
        } catch (err: any) {
            console.error(err);
            setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: AuthInput.AdminLoginDto) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-slate-50">
            <div className="glass-panel-strong rounded-[32px] p-8 w-[min(420px,92vw)] shadow-[0_30px_70px_rgba(15,23,42,0.18)] animate-pop bg-white">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">관리자 로그인</h1>
                        <p className="text-xs text-slate-500">Service Administration</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">이메일</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:shadow-sm"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-medium text-rose-500 ml-1 animate-pulse">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full h-12 rounded-2xl bg-slate-900 font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}
