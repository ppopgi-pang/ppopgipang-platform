import { useCallback, useEffect, useRef, useState } from "react";
import type { Toast as ToastType } from "@/stores/common/toast.store";
import { ZINDEX } from "@/constants/z-index";
import {
  TOAST_CLOSE_ANIMATION_DURATION,
  TOAST_SHOW_DURATION,
} from "@/constants";

interface ToastProps extends ToastType {
  onClose: () => void;
}

export function Toast({
  message,
  hasOnClose = false,
  type = "default",
  duration = TOAST_SHOW_DURATION,
  onClose,
}: ToastProps) {
  const [isAdded, setIsAdded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const showAnimationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideAnimationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typeStyles = {
    default: "bg-gray-800 text-white",
    success: "bg-status-success text-white",
    error: "bg-status-error text-white",
    warning: "bg-status-warning text-white",
    info: "bg-status-info text-white",
  };

  const handleClose = useCallback(() => {
    setIsVisible(false);

    hideAnimationRef.current = setTimeout(() => {
      setIsAdded(false);
      onClose();
      if (showAnimationRef.current) {
        clearTimeout(showAnimationRef.current);
      }
    }, TOAST_CLOSE_ANIMATION_DURATION);
  }, [onClose]);

  useEffect(() => {
    showAnimationRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (showAnimationRef.current) {
        clearTimeout(showAnimationRef.current);
      }
      if (hideAnimationRef.current) {
        clearTimeout(hideAnimationRef.current);
      }
    };
  }, [duration, handleClose]);

  if (!isAdded) return null;

  return (
    <div
      className={`
        ${typeStyles[type]}
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        min-w-[280px] max-w-[400px]
        transition-all duration-300
        ${isVisible ? "animate-slide-in-right opacity-100" : "opacity-0 translate-x-full"}
      `}
      style={{ zIndex: ZINDEX.toast }}
      role="alert"
      aria-live="assertive"
    >
      <p className="flex-1 text-sm font-medium">{message}</p>
      {hasOnClose && (
        <button
          onClick={handleClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
