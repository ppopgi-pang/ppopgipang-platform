import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className=" w-full  shrink-0 bg-white min-h-17 flex items-center justify-between px-3 py-2">
      <span className=" text-2xl text-sky-500 font-mbc">뽑기팡</span>
      <Link to={"/login"} className="font-bold text-base text-sky-400">
        로그인
      </Link>
    </header>
  );
}
