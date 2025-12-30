// import KakaoIcon from "@/assets/icons/buttons/ic-kakao.svg?react";
// const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID ?? "";
// const getKakaoLoginUrl = () => {
//   if (!KAKAO_CLIENT_ID) {
//     console.error("Missing VITE_KAKAO_CLIENT_ID");
//     return "#";
//   }
//   const redirectUri = `${API_V1_BASE_URL}/auth/kakao/callback`;
//   const authorizeParams = new URLSearchParams({
//     client_id: KAKAO_CLIENT_ID,
//     redirect_uri: redirectUri,
//     response_type: "code",
//     through_account: "true",
//   });
//   const authorizeUrl = `https://kauth.kakao.com/oauth/authorize?${authorizeParams.toString()}`;
//   const loginParams = new URLSearchParams({ continue: authorizeUrl });
//   return `https://accounts.kakao.com/login/?${loginParams.toString()}#login`;
// };

// function LoginButton() {
//   const search = Route.useSearch();

//   const handleKakaoLogin = () => {
//     if (search.redirect) {
//       sessionStorage.setItem("auth_return_url", search.redirect);
//     }
//     window.location.href = getKakaoLoginUrl();
//   };

//   const a = () => {};
//   return (
//     <button
//       type="button"
//       onClick={onHandleLogin}
//       className="mb-5 mobile:mb-7 flex w-full cursor-pointer items-center justify-center gap-2 mobile:rounded-[8px] rounded-md bg-[#FEE500] mobile:py-4 py-3 text-black"
//     >
//       <KakaoIcon className="w-5 h-5" />
//       <span className=" mobile:text-base text-base">카카오 로그인</span>
//     </button>
//   );
// }

// export default LoginButton;
