import KakaoIcon from "@/assets/icons/buttons/ic-kakao.svg?react";
import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID ?? "";

// 백엔드 API 서버 URL (카카오 콜백은 백엔드로 가야 함)
const API_SERVER_URL = import.meta.env.PROD
  ? "https://ppopgi.me"
  : "http://localhost:3000"; // 로컬 백엔드 서버 사용 시

const getKakaoLoginUrl = () => {
  if (!KAKAO_CLIENT_ID) {
    console.error("Missing VITE_KAKAO_CLIENT_ID");
    return "#";
  }
  const redirectUri = `${API_SERVER_URL}/api/v1/auth/kakao/callback`;
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

const LoginSearchSchema = z.object({
  redirect: z.string().optional(),
});

function LoginPage() {
  const search = Route.useSearch();

  const handleKakaoLogin = () => {
    if (search.redirect) {
      sessionStorage.setItem("auth_return_url", search.redirect);
    }
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="flex min-w-[70%] md:min-w-[300px]  md:max-h-[559px] md:w-[374px] flex-col md:justify-between">
        <header className="mb-[72px] mobile:mb-[92px] flex flex-col items-center">
          <Link
            to="/"
            className="text-6xl mobile:text-7xl text-sky-500 font-mbc"
          >
            뽑기팡
          </Link>

          <h1 className="sr-only">뽑기팡</h1>
          <p className="text-center font-normal mobile:text-base text-[13px] text-gray-500">
            뽑기팡과 함께 즐뽑해봐요!
          </p>
        </header>

        <main className="mb-1 flex flex-col">
          <h2 className="mb-9 text-center font-normal mobile:text-[25px] text-lg">
            서비스를 이용하려면
            <br />
            로그인하세요
          </h2>

          <button
            type="button"
            onClick={handleKakaoLogin}
            className="mb-5 mobile:mb-7 flex w-full cursor-pointer items-center justify-center gap-2 mobile:rounded-[8px] rounded-md bg-[#FEE500] mobile:py-4 py-3 text-black"
          >
            <KakaoIcon className="w-5 h-5" />
            <span className=" mobile:text-base text-base">카카오 로그인</span>
          </button>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_mobile/login")({
  validateSearch: (search) => LoginSearchSchema.parse(search),
  component: LoginPage,
});
