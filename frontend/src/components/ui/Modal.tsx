"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  /** false = the user must press one of the buttons inside (e.g. "Out of hearts") */
  dismissible?: boolean;
  children: ReactNode;
}

/** Dark overlay + centred white card. Closes on Escape or a click outside when dismissible. */
export default function Modal({ open, onClose, dismissible = true, children }: ModalProps) {
  useEffect(() => {
    if (!open || !dismissible || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md animate-pop-in rounded-3xl bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()} // clicks inside must not reach the overlay
      >
        {children}
      </div>
    </div>
  );
}