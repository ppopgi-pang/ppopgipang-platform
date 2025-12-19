import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { tokenManager } from "@/shared/lib/token-manager";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!tokenManager.getAccessToken());
  }, []);

  const handleLogout = () => {
    tokenManager.removeTokens();
    setIsLoggedIn(false);
    navigate({ to: "/" });
  };

  const handleLogin = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="w-full min-h-screen px-5 pt-8 pb-[var(--page-safe-bottom)]">
      <h1 className="text-xl font-bold text-slate-900">내 정보</h1>
      <p className="mt-1 text-sm text-slate-500">
        내 계정 상태를 간단하게 확인할 수 있어요.
      </p>

      <div className="mt-5 rounded-2xl bg-white border border-slate-200 p-4">
        <div className="text-xs text-slate-400">로그인 상태</div>
        <div className="mt-1 text-base font-semibold text-slate-900">
          {isLoggedIn ? "로그인됨" : "로그인 필요"}
        </div>

        <div className="mt-4 text-xs text-slate-400">로그인 방식</div>
        <div className="mt-1 text-sm text-slate-700">
          {isLoggedIn ? "카카오 로그인" : "-"}
        </div>
      </div>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          로그아웃
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-full bg-sky-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
        >
          로그인하기
        </button>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_header_layout/profile/")({
  component: ProfilePage,
});
