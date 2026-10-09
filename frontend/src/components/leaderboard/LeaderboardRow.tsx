import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import type { LeaderboardEntry } from "@/lib/types";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

/** One line of the leaderboard. The learner's own row is highlighted. */
export default function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-2xl border-2 px-4 py-3",
        entry.is_me
          ? "border-ice-border bg-ice text-[#202020]"
          : "border-transparent",
      )}
    >
      <span
        className={cn(
          "w-8 text-center text-xl font-extrabold",
          entry.is_me ? "text-[#202020]" : "text-wolf",
        )}
      >
        {MEDALS[entry.rank] ?? entry.rank}
      </span>

      <Avatar name={entry.name} seed={entry.user_id} />

      <span className="flex-1 truncate text-lg font-extrabold">
        {entry.name}
        {entry.is_me && (
          <span className="ml-2 text-sm font-bold text-macaw">You</span>
        )}
      </span>

      <span
        className={cn(
          "font-extrabold",
          entry.is_me ? "text-[#202020]" : "text-wolf",
        )}
      >
        {entry.weekly_xp} XP
      </span>
    </li>
  );
}