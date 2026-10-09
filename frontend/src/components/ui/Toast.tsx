"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ToastVariant = "info" | "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type ShowToast = (message: string, variant?: ToastVariant) => void;

const ToastContext = createContext<ShowToast | null>(null);

const styles: Record<ToastVariant, string> = {
  info: "bg-eel text-white",
  success: "bg-feather text-white",
  error: "bg-cardinal text-white",
};

let nextId = 1;

/** Wrap the app once; any component can then call  const toast = useToast(); toast("Saved!") */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback<ShowToast>((message, variant = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000); // auto-dismiss
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn("animate-slide-down rounded-2xl px-5 py-3 text-sm font-extrabold shadow-lg", styles[t.variant])}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}