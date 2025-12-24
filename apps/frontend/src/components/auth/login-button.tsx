import KakaoIcon from "@/assets/icons/buttons/ic-kakao.svg?react";

function LoginButton({ onHandleLogin }: { onHandleLogin: () => void }) {
  return (
    <button
      type="button"
      onClick={onHandleLogin}
      className="mb-5 mobile:mb-7 flex w-full cursor-pointer items-center justify-center gap-2 mobile:rounded-[8px] rounded-md bg-[#FEE500] mobile:py-4 py-3 text-black"
    >
      <KakaoIcon className="w-5 h-5" />
      <span className=" mobile:text-base text-base">카카오 로그인</span>
    </button>
  );
}

export default LoginButton;
