"use client";

import LeaderboardRow from "@/components/leaderboard/LeaderboardRow";
import LoadError from "@/components/ui/LoadError";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

export default function LeaderboardPage() {
  const { data: entries, error, loading, retry } = useApi(api.getLeaderboard);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="text-6xl" aria-hidden="true">
          🛡️
        </span>
        <h1 className="text-3xl font-black">Leaderboard</h1>
        <p className="font-bold text-wolf">XP earned in the last 7 days. Finish lessons to climb!</p>
      </header>

      {error && <LoadError message={error} onRetry={retry} />}

      {loading && (
        <div className="flex animate-pulse flex-col gap-3" aria-label="Loading leaderboard">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-swan" />
          ))}
        </div>
      )}

      {entries && (
        <ol className="flex flex-col gap-1">
          {entries.map((entry) => (
            <LeaderboardRow key={entry.user_id} entry={entry} />
          ))}
        </ol>
      )}
    </div>
  );
}