import { createFileRoute } from "@tanstack/react-router";

const LoginPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = "https://accounts.kakao.com/login/?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fclient_id%3D7f3836bbb2b4ee4a2cf5aea56e668850%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fapi%252Fv1%252Fauth%252Fkakao%252Fcallback%26response_type%3Dcode%26through_account%3Dtrue%26auth_tran_id%3Dfw3PKShSYe5KXeL_YXCudqElO7mOHRtZdfPZpYMEChcGLgAAAZpjKhfl#login";
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
