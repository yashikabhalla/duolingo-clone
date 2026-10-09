import { cn } from "@/lib/cn";

type BarColor = "green" | "yellow" | "blue";

const fillColors: Record<BarColor, string> = {
  green: "bg-feather",
  yellow: "bg-bee",
  blue: "bg-macaw",
};

interface ProgressBarProps {
  value: number; // 0 - 100
  color?: BarColor;
  label?: string; // optional text centred on the bar, e.g. "10 / 20"
  className?: string;
}

/** Grey track + coloured fill with the little shine strip Duolingo draws on top. */
export default function ProgressBar({ value, color = "green", label, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative w-full overflow-hidden rounded-full bg-swan", label ? "h-6" : "h-4", className)}
    >
      <div
        className={cn("relative h-full rounded-full transition-[width] duration-500 ease-out", fillColors[color])}
        style={{ width: `${pct}%`, minWidth: pct > 0 ? "1rem" : 0 }}
      >
        {/* shine strip */}
        <div className="absolute left-2 right-2 top-1 h-1 rounded-full bg-white/30" />
      </div>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-eel">
          {label}
        </span>
      )}
    </div>
  );
}