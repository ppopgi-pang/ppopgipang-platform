import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "검색",
  maxLength = 60,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) {
        onSearch(trimmed);
      }
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  // const handleSearchClick = () => {
  //   const trimmed = value.trim();
  //   if (trimmed) {
  //     onSearch(trimmed);
  //   }
  // };

  return (
    <div className="flex items-center w-full px-4 py-3 bg-gray-100 rounded-full h-12 gap-3 border-2 border-transparent focus-within:border-blue-300 transition-colors">
      <input
        ref={inputRef}
        className="flex-1 bg-transparent focus:outline-none placeholder:text-gray-500 text-gray-800"
        maxLength={maxLength}
        placeholder={placeholder}
        type="search"
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer bg-gray-400 rounded-full p-1"
          aria-label="검색어 지우기"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      {/* <button
        onClick={handleSearchClick}
        type="button"
        className="p-1 hover:opacity-70 transition-opacity"
        aria-label="검색"
        disabled={!value.trim()}
      >
        <img src="/icons/ic-search.svg" className="w-5 h-5" alt="" />
      </button> */}
    </div>
  );
}
