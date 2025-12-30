import React from "react";
import GoBackIcon from "@/assets/icons/buttons/ic-back.svg?react";

interface GoBackButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export default function GoBackButton({ onClick, ...props }: GoBackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="hover:text-gray-600 text-gray-800 p-1 cursor-pointer transition-colors duration-200"
      {...props}
    >
      <GoBackIcon />
    </button>
  );
}
