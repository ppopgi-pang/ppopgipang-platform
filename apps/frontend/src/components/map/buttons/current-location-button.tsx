import { cn } from "@/libs/common/cn";

interface CurrentLocationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const CurrentLocationButton = ({
  onClick,
  disabled = false,
  isLoading = false,
  className,
}: CurrentLocationButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={cn(
        "absolute bottom-0 right-0 -translate-x-3 -translate-y-10 flex h-12 w-12 items-center justify-center z-1",
        "rounded-full bg-white shadow-md",
        "transition-all duration-200",

        "hover:shadow-lg active:scale-95",

        disabled && "opacity-50 cursor-not-allowed",
        isLoading && "animate-pulse",

        className,
      )}
      aria-label="현재 위치로 이동"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-6 w-6 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-colors",
            disabled ? "text-gray-400" : "text-gray-700",
          )}
        >
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path
            d="M12 2V5M12 19V22M22 12H19M5 12H2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
};
