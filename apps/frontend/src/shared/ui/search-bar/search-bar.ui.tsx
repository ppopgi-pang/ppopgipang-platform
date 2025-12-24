interface SearchBarProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: () => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
    return (
        <div className="flex items-center w-full h-12 glass-panel glass-pill px-4 gap-3 animate-fade-up focus-within:ring-2 focus-within:ring-sky-200/70">
            <input
                className="flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
                key="random1"
                maxLength={60}
                placeholder="뽑기방 검색"
                type="search"
                aria-label="뽑기방 검색"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch?.();
                    }
                }}
            />
        </div>
    )
}
