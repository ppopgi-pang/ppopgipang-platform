import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "default" | "warning" | "info";
  duration?: number;
  hasOnClose?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Date.now(),
          type: toast.type ?? "default",
          duration: toast.duration ?? 3000,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
