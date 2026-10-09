"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";

import StatsBar from "./StatsBar";

/** Right-hand column on desktop: stats, Super promo (mocked) and the daily goal. */
export default function RightPanel() {
  const { user } = useUser();
  const toast = useToast();

  const goal = user?.daily_goal_xp ?? 0;
  const done = user ? Math.min(user.today_xp, goal) : 0;

  return (
    <div className="flex flex-col gap-4">
      <StatsBar />

      <Card>
        <span className="rounded-md bg-beetle px-2 py-0.5 text-xs font-black uppercase tracking-wider text-white">
          Super
        </span>
        <h2 className="mt-2 text-lg font-extrabold">Try Super for free</h2>
        <p className="mb-4 mt-1 text-[15px] font-bold text-wolf">
          No ads, personalized practice, and unlimited Legendary!
        </p>
        <Button
          variant="blue"
          fullWidth
          onClick={() => toast("Super is coming soon!")}
          className="!bg-[#3F4DF5] !shadow-[0_4px_0_#3B23E3]"
        >
          Try 1 week free
        </Button>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Daily Quests</h2>
          <Link
            href="/quests"
            className="text-sm font-extrabold uppercase tracking-wider text-macaw"
          >
            View all
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>

          <div className="flex-1">
            <p className="mb-1.5 font-extrabold">
              {goal ? `Earn ${goal} XP` : "Earn XP"}
            </p>

            <ProgressBar
              color="yellow"
              value={goal ? (done / goal) * 100 : 0}
              label={goal ? `${done} / ${goal}` : undefined}
            />
          </div>

          <span className="text-3xl">
            {user?.daily_goal_met ? "🎁" : "🔒"}
          </span>
        </div>
      </Card>
    </div>
  );
}