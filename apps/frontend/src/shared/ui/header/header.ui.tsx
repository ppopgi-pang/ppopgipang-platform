import { useAuthStore } from "@/stores/auth/auth-store";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const { user } = useAuthStore();
  return (
    <header className=" w-full shrink-0 bg-white min-h-17 flex items-center justify-between px-3 py-2">
      <span className=" text-2xl text-sky-500 font-mbc">뽑기팡</span>
      {!user?.id ? (
        <Link to={"/login"} className="font-bold text-base text-sky-400">
          로그인
        </Link>
      ) : (
        <div className="flex items-center">
          <img
            src={user.profileImage ?? ""}
            className="w-8 h-8 rounded-full border-2 border-sky-300"
          />
        </div>
      )}
    </header>
  );
}
