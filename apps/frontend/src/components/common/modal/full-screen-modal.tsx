import { type ReactNode } from "react";

export default function FullScreenModal({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-white w-full h-full z-50">
      {children}
    </div>
  );
}
