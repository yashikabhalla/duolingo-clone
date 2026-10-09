import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Achievement } from "@/lib/types";

/** An achievement badge: in colour when earned, greyed out and locked when not. */
export default function BadgeCard({ badge }: { badge: Achievement }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 transition",
        badge.earned
          ? "hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.08)]"
          : "opacity-80",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-[0_3px_0_rgba(0,0,0,0.12)]",
            badge.earned
              ? "bg-bee"
              : "bg-swan grayscale",
          )}
          aria-hidden="true"
        >
          {badge.earned ? badge.icon : "🔒"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "font-extrabold text-eel",
                !badge.earned && "text-wolf",
              )}
            >
              {badge.name}
            </p>

            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
                badge.earned
                  ? "bg-feather/15 text-feather"
                  : "bg-swan text-wolf",
              )}
            >
              {badge.earned ? "Earned" : "Locked"}
            </span>
          </div>

          <p className="mt-1 text-sm font-bold leading-relaxed text-wolf">
            {badge.description}
          </p>

          {badge.earned && badge.earned_at && (
            <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-feather">
              Earned{" "}
              {new Date(badge.earned_at).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {badge.earned && (
        <div className="absolute right-0 top-0 h-1 w-full bg-feather" />
      )}
    </Card>
  );
}