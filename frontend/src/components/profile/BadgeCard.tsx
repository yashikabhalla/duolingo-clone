import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Achievement } from "@/lib/types";

/** An achievement badge: in colour when earned, greyed out and locked when not. */
export default function BadgeCard({ badge }: { badge: Achievement }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <span
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl",
          badge.earned ? "bg-bee" : "bg-swan grayscale",
        )}
        aria-hidden="true"
      >
        {badge.earned ? badge.icon : "🔒"}
      </span>
      <div className="min-w-0">
        <p className={cn("font-extrabold", !badge.earned && "text-wolf")}>{badge.name}</p>
        <p className="text-sm font-bold text-wolf">{badge.description}</p>
        {badge.earned && badge.earned_at && (
          <p className="mt-0.5 text-xs font-extrabold uppercase tracking-wider text-feather">
            Earned {new Date(badge.earned_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}