import { cn } from "@/lib/cn";

import type { UnitTheme } from "./unitThemes";

interface UnitBannerProps {
  label: string; // e.g. "Section 1, Unit 1"
  title: string;
  theme: UnitTheme;
  onGuidebook: () => void;
}

/** The coloured header above each unit. It sticks to the top while you scroll through its nodes. */
export default function UnitBanner({ label, title, theme, onGuidebook }: UnitBannerProps) {
  return (
    <div
      className={cn(
        "sticky top-4 z-10 flex items-center justify-between gap-3 rounded-2xl p-4 text-white",
        theme.banner,
        theme.bannerShadow,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-extrabold uppercase tracking-wider text-white/80">
          <span aria-hidden="true">← </span>
          {label}
        </p>
        <h2 className="truncate text-xl font-extrabold">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onGuidebook}
        className="flex shrink-0 items-center gap-2 rounded-2xl border-2 border-black/15 bg-black/10 px-4 py-3 text-sm font-extrabold uppercase tracking-wider hover:bg-black/15 active:translate-y-0.5"
      >
        <span aria-hidden="true">📖</span>
        <span className="hidden sm:inline">Guidebook</span>
      </button>
    </div>
  );
}