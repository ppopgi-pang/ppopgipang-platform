import type { IconProps } from "./icon-props";

export function HomeIcon({ size = 24, active = false }: IconProps) {
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
        d="M3 9L12 2L21 9M5 7.5V18C5 18.663 5.537 19.2 6.2 19.2H9.6V14.4C9.6 13.737 10.137 13.2 10.8 13.2H13.2C13.863 13.2 14.4 13.737 14.4 14.4V19.2H17.8C18.463 19.2 19 18.663 19 18V7.5M8.4 19.2H15.6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
