import type { IconProps } from "./icon-props";

export function CollectionIcon({ size = 24, active = false }: IconProps) {
  const color = active ? "#38BDF8" : "#6B7280";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 책의 메인 구조 */}
      <path
        d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.4C20 16.7314 19.7314 17 19.4 17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H19.4C19.7314 21 20 20.7314 20 20.4V17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 하트 */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        transform="translate(4.8, 3) scale(0.6)"
        fill={color}
        stroke="none"
      />
    </svg>
  );
}
