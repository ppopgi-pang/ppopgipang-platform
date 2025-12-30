import type { IconProps } from "./icon-props";

export function MapIcon({ size = 24, active = false }: IconProps) {
  const color = active ? "#38BDF8" : "#222222";
  const opacity = active ? 1 : 0.3;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity={opacity}
    >
      <path
        d="M9 4L3 6V20L9 18M9 4L15 6M9 4V18M15 6L21 4V18L15 20M15 6V20M9 18L15 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* <circle cx="15" cy="11" r="2" stroke={color} strokeWidth="1.5" /> */}
    </svg>
  );
}
