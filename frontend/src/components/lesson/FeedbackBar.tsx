import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AnswerResult } from "@/lib/types";

import type { Phase } from "./lessonReducer";

interface FeedbackBarProps {
  phase: Phase;
  result: AnswerResult | null;
  canCheck: boolean;
  successMessage: string;
  onCheck: () => void;
  onSkip: () => void;
  onContinue: () => void;
}

/** The bar at the bottom: white with CHECK/SKIP while answering, then slides up green or red. */
export default function FeedbackBar({
  phase,
  result,
  canCheck,
  successMessage,
  onCheck,
  onSkip,
  onContinue,
}: FeedbackBarProps) {
  const showingFeedback = phase === "feedback" && result !== null;
  const correct = result?.correct ?? false;

  return (
    <footer
      className={cn(
        "border-t-2",
        showingFeedback ? cn("animate-slide-up border-transparent", correct ? "bg-correct-bg" : "bg-wrong-bg") : "border-swan bg-white",
      )}
    >
      <div className="mx-auto flex min-h-[96px] max-w-[1000px] items-center justify-between gap-4 px-4 py-4 sm:min-h-[140px] sm:py-6">
        {showingFeedback ? (
          <>
            <div className="flex items-center gap-4" role="status" aria-live="polite">
              <div
                className={cn(
                  "hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-black sm:flex",
                  correct ? "text-feather" : "text-cardinal",
                )}
                aria-hidden="true"
              >
                {correct ? "✓" : "✕"}
              </div>
              <div className={correct ? "text-feather-dark" : "text-cardinal-dark"}>
                <p className="text-xl font-extrabold sm:text-2xl">{correct ? successMessage : "Correct solution:"}</p>
                {!correct && <p className="text-base font-bold sm:text-lg">{result.correct_answer}</p>}
              </div>
            </div>
            <Button variant={correct ? "primary" : "danger"} size="lg" onClick={onContinue} className="min-w-[130px] sm:min-w-[160px]">
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="lg" onClick={onSkip} disabled={phase !== "answering"} className="hidden sm:inline-flex sm:min-w-[130px]">
              Skip
            </Button>
            <Button
              size="lg"
              onClick={onCheck}
              disabled={!canCheck}
              className="w-full sm:ml-auto sm:w-auto sm:min-w-[160px]"
            >
              Check
            </Button>
          </>
        )}
      </div>
    </footer>
  );
}