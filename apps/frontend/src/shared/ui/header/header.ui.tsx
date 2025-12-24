import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-[var(--header-height)] px-4 flex items-center justify-between glass-panel border-b border-white/40 shadow-[0_10px_30px_rgba(15,23,42,0.1)] animate-fade-up">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/icons/ppopgipang-icon.png"
          alt="뽑기팡"
          className="w-10 h-10 rounded-[14px] shadow-[0_8px_18px_rgba(56,189,248,0.35)]"
        />
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-slate-900 font-['Righteous']">뽑기팡</span>
          <span className="text-[11px] text-slate-500">리퀴드 글래스 라이브</span>
        </div>
      </Link>
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <span className="liquid-chip px-3 py-1">오늘의 뽑기</span>
        <span className="text-[11px]">근처 매장 탐색</span>
      </div>
    </header>
  )
}
