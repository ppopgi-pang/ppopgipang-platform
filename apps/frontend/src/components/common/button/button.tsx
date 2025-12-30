import { forwardRef } from "react";
import type { ButtonProps } from "./button.type";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "medium",
      isLoading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) {
    const variantStyles = {
      primary:
        "bg-brand-primary hover:bg-button-primary-hover active:bg-button-primary-active text-white",
      secondary:
        "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-text-primary",
      tertiary:
        "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-text-secondary border border-border-default",
      destructive:
        "bg-status-error hover:bg-red-600 active:bg-red-700 text-white",
      kakao:
        "bg-[#FEE500] hover:bg-[#E5CE00] active:bg-[#CCBA00] text-[#181600]",
    };

    const sizeStyles = {
      small: "px-3 py-1.5 text-sm rounded",
      medium: "px-4 py-2 text-base rounded-lg",
      semiLarge: "px-5 py-2.5 text-base rounded-lg",
      large: "px-6 py-3 text-lg rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current
          ${isLoading ? "cursor-wait" : ""}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
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
            로딩 중...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

export default Button;
