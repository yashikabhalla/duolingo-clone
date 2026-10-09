"use client";

import BadgeCard from "@/components/profile/BadgeCard";
import StatTile from "@/components/profile/StatTile";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadError from "@/components/ui/LoadError";
import ProgressBar from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, error: userError } = useUser();
  const { data: badges, error, loading, retry } = useApi(api.getAchievements);
  const toast = useToast();

  if (userError) return <LoadError message={userError} onRetry={() => window.location.reload()} />;
  if (!user) return <div className="h-64 animate-pulse rounded-2xl bg-swan" aria-label="Loading profile" />;

  const goalPercent = user.daily_goal_xp > 0 ? (Math.min(user.today_xp, user.daily_goal_xp) / user.daily_goal_xp) * 100 : 0;
  const earned = badges?.filter((b) => b.earned).length ?? 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="flex items-center gap-5">
        <Avatar name={user.name} seed={user.id} size={96} />
        <div>
          <h1 className="text-3xl font-black">{user.name}</h1>
          <p className="font-bold text-wolf">Learning Spanish</p>
        </div>
      </header>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="mb-3 text-2xl font-extrabold">
          Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatTile icon="🔥" value={user.streak} label="Day streak" />
          <StatTile icon="⚡" value={user.total_xp} label="Total XP" />
          <StatTile icon="📚" value={user.lessons_completed} label="Lessons completed" />
          <StatTile icon="💎" value={user.gems} label="Gems" />
        </div>
        <Card className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-extrabold">Daily goal</p>
            <p className="text-sm font-bold text-wolf">{user.daily_goal_met ? "Goal reached! 🎉" : "Keep going!"}</p>
          </div>
          <ProgressBar color="yellow" value={goalPercent} label={`${Math.min(user.today_xp, user.daily_goal_xp)} / ${user.daily_goal_xp} XP`} />
        </Card>
      </section>

      <section aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="mb-3 text-2xl font-extrabold">
          Achievements {badges && <span className="text-lg text-wolf">({earned}/{badges.length})</span>}
        </h2>
        {error && <LoadError message={error} onRetry={retry} />}
        {loading && <div className="h-40 animate-pulse rounded-2xl bg-swan" aria-label="Loading achievements" />}
        {badges && (
          <div className="grid gap-3 sm:grid-cols-2">
            {badges.map((b) => (
              <BadgeCard key={b.code} badge={b} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="friends-heading">
        <h2 id="friends-heading" className="mb-3 text-2xl font-extrabold">
          Friends
        </h2>
        <Card className="flex items-center justify-between gap-4">
          <p className="font-bold text-wolf">Add friends to learn together. Coming soon!</p>
          <Button variant="secondary" size="sm" onClick={() => toast("Friends is coming soon!")}>
            Add friends
          </Button>
        </Card>
      </section>
    </div>
  );
}