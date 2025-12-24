import { createFileRoute } from "@tanstack/react-router";
import { API_V1_BASE_URL } from "@/shared/lib/api-config";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID ?? "";

const getKakaoLoginUrl = () => {
  if (!KAKAO_CLIENT_ID) {
    console.error("Missing VITE_KAKAO_CLIENT_ID");
    return "#";
  }
  const redirectUri = `${API_V1_BASE_URL}/auth/kakao/callback`;
  const authorizeParams = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    through_account: "true",
  });
  const authorizeUrl = `https://kauth.kakao.com/oauth/authorize?${authorizeParams.toString()}`;
  const loginParams = new URLSearchParams({ continue: authorizeUrl });
  return `https://accounts.kakao.com/login/?${loginParams.toString()}#login`;
};

const LoginPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="glass-panel-strong rounded-[32px] p-8 w-[min(420px,92vw)] shadow-[0_30px_70px_rgba(15,23,42,0.18)] animate-pop">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/icons/ppopgipang-icon.png"
            alt="뽑기팡"
            className="w-12 h-12 rounded-[16px] shadow-[0_10px_20px_rgba(56,189,248,0.35)]"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">뽑기팡 로그인</h1>
            <p className="text-xs text-slate-500">유리처럼 부드러운 경험을 시작해요.</p>
          </div>
        </div>
        <button
          onClick={handleKakaoLogin}
          className="w-full py-3 rounded-full font-semibold text-slate-900 bg-[#FEE500] shadow-[0_12px_24px_rgba(254,229,0,0.25)] hover:brightness-105 transition-all"
        >
          카카오로 시작하기
        </button>
        <p className="mt-4 text-xs text-slate-500 text-center">
          로그인 시 이용약관 및 개인정보 처리방침에 동의한 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});
