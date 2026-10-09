import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "blue" | "danger" | "danger-outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

// Shared by every variant: rounded, bold uppercase text with letter-spacing, and the
// greyed-out look when disabled (this is the grey "CHECK" button before you pick an answer).
const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-2 font-extrabold uppercase " +
  "tracking-wider select-none whitespace-nowrap transition-[transform,box-shadow,filter] duration-100 " +
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-swan disabled:text-hare disabled:shadow-none";

// The 3D effect: a solid shadow under the button is its "thickness".
// On press (only while enabled) the button moves down by that thickness and the shadow vanishes.
const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-feather text-white shadow-3d-feather enabled:hover:brightness-105 " +
    "enabled:active:translate-y-1 enabled:active:shadow-none",
  blue:
    "border-transparent bg-macaw text-white shadow-3d-macaw enabled:hover:brightness-105 " +
    "enabled:active:translate-y-1 enabled:active:shadow-none",
  danger:
    "border-transparent bg-cardinal text-white shadow-3d-cardinal enabled:hover:brightness-105 " +
    "enabled:active:translate-y-1 enabled:active:shadow-none",
  secondary:
    "border-swan bg-white text-macaw shadow-3d-swan enabled:hover:bg-polar " +
    "enabled:active:translate-y-0.5 enabled:active:shadow-none",
  "danger-outline":
    "border-swan bg-white text-cardinal shadow-3d-swan enabled:hover:bg-polar " +
    "enabled:active:translate-y-0.5 enabled:active:shadow-none",
  ghost: "border-transparent bg-transparent text-macaw shadow-none enabled:hover:bg-ice",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-4 py-3 text-[15px]",
  lg: "px-5 py-3.5 text-[17px]",
};

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Exported separately so a <Link> can look exactly like a button:
 *  <Link href="/learn" className={buttonClasses({ variant: "primary" })}> */
export function buttonClasses({ variant = "primary", size = "md", fullWidth, className }: StyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleOptions {}

export default function Button({ variant, size, fullWidth, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...rest} />;
}