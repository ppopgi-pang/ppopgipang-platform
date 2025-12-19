export default function SearchBar() {
  return (
     <div className="flex items-center w-full h-12 glass-panel glass-pill px-4 gap-3 animate-fade-up focus-within:ring-2 focus-within:ring-sky-200/70">
            <input 
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                key="random1"
                maxLength={60}
                placeholder="뽑기방 검색"
                type="search"
                aria-label="뽑기방 검색"
            />
            <button
                onClick={() => {}}
                type="button"
                className="w-9 h-9 rounded-full liquid-chip flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                aria-label="검색"
            >
                <img src={'/icons/ic-search.svg'} className="w-5 h-5" alt="" />
            </button>
        </div>
  )
}
