export type ToastType = "success" | "warning" | "error";
export interface Toast {
  id: number;
  message: string;
  type?: ToastType;
  duration?: number;
}
