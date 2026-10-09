import Button from "@/components/ui/Button";
import Mascot from "@/components/ui/Mascot";
import type { CompleteResult } from "@/lib/types";

import Confetti from "./Confetti";

export type Completion =
  | { status: "saving" }
  | { status: "error" }
  | { status: "done"; result: CompleteResult };

interface LessonCompleteProps {
  completion: Completion;
  accuracy: number;
  nextLessonId: number | null;
  onContinue: () => void;
  onRetry: () => void;
}

const CARD_STYLES = {
  bee: { box: "border-bee bg-bee", value: "text-bee-dark" },
  feather: { box: "border-feather bg-feather", value: "text-feather-dark" },
};

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: keyof typeof CARD_STYLES;
}) {
  const style = CARD_STYLES[color];

  return (
    <div className={`w-36 overflow-hidden rounded-2xl border-2 ${style.box}`}>
      <p className="py-1 text-center text-xs font-extrabold uppercase tracking-wider text-white">
        {title}
      </p>
      <p
        className={`rounded-xl bg-white py-3 text-center text-xl font-extrabold ${style.value}`}
      >
        {value}
      </p>
    </div>
  );
}

/** Full-screen celebration after the last exercise. */
export default function LessonComplete({
  completion,
  accuracy,
  nextLessonId,
  onContinue,
  onRetry,
}: LessonCompleteProps) {
  const done = completion.status === "done" ? completion.result : null;

  return (
    <div className="flex min-h-screen flex-col">
      {done && <Confetti />}

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <Mascot size={150} />

        <h1 className="text-3xl font-black text-bee">
          Lesson Complete!
        </h1>

        {completion.status === "error" ? (
          <p className="font-bold text-cardinal">
            We couldn&apos;t save your progress. Check your connection and try
            again.
          </p>
        ) : (
          <div className="flex gap-4">
            <StatCard
              title="Total XP"
              value={done ? `⚡ ${done.xp_earned}` : "…"}
              color="bee"
            />
            <StatCard
              title="Accuracy"
              value={`🎯 ${accuracy}%`}
              color="feather"
            />
          </div>
        )}

        {done && (
          <div className="flex flex-col gap-2 font-extrabold text-wolf">
            {done.skill_completed && (
              <p className="text-lg text-bee-dark">⭐ Skill complete!</p>
            )}

            {done.daily_goal_just_met && (
              <p className="text-lg text-feather-dark">
                🎉 Daily goal reached!
              </p>
            )}

            <p>🔥 {done.streak} day streak</p>

            {done.new_achievements.map((a) => (
              <p key={a.code} className="text-beetle">
                {a.icon} New badge: {a.name}
              </p>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t-2 border-swan">
        <div className="mx-auto flex min-h-[96px] max-w-[1000px] items-center justify-end px-4 sm:min-h-[140px]">
          {completion.status === "error" ? (
            <Button
              size="lg"
              onClick={onRetry}
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              Try again
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={completion.status === "saving"}
              onClick={onContinue}
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              {completion.status === "done" && nextLessonId !== null
                ? "Next lesson"
                : "Back to learning"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}