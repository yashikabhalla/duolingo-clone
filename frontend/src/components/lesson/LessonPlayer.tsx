"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import { ApiError, api } from "@/lib/api";
import type { AnswerValue, Lesson } from "@/lib/types";

import { EXERCISE_COMPONENTS } from "./exercises";
import FeedbackBar from "./FeedbackBar";
import LessonComplete, { type Completion } from "./LessonComplete";
import LessonHeader from "./LessonHeader";
import { createInitialState, lessonReducer } from "./lessonReducer";
import OutOfHeartsModal from "./OutOfHeartsModal";
import QuitModal from "./QuitModal";

const SUCCESS_MESSAGES = ["Nicely done!", "Amazing!", "Great job!", "Correct!", "Awesome!"];

/** Runs one lesson. The reducer owns the rules; this component connects it to the API and the screen. */
export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const toast = useToast();
  const { user, refresh, setUser } = useUser();

  const [state, dispatch] = useReducer(lessonReducer, lesson, (l) => createInitialState(l.exercises, l.hearts));
  const [quitOpen, setQuitOpen] = useState(false);
  const [refilling, setRefilling] = useState(false);
  const [completion, setCompletion] = useState<Completion>({ status: "saving" });
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);

  const exercise = state.queue[state.index];
  const canCheck = state.phase === "answering" && state.answer !== null;
  const progress = (state.correctCount / state.total) * 100;
  const accuracy = Math.round((state.total / (state.total + state.mistakes)) * 100);

  // ---------- actions ----------

  async function submit(answer: AnswerValue) {
    if (state.phase !== "answering") return;
    dispatch({ type: "CHECK_STARTED" });
    try {
      // the SERVER decides whether the answer is right (and takes the heart if it is not)
      const result = await api.submitAnswer(lesson.id, exercise.id, answer);
      dispatch({ type: "CHECK_DONE", result });
    } catch (e) {
      dispatch({ type: "CHECK_FAILED" });
      toast(e instanceof ApiError && e.detail === "out_of_hearts" ? "You're out of hearts!" : "Something went wrong. Try again.", "error");
    }
  }

  const handleCheck = () => {
    if (state.answer !== null) void submit(state.answer);
  };
  const handleSkip = () => void submit(""); // an empty answer is always wrong, so Skip counts as a mistake

  async function finishLesson() {
  setCompletion({ status: "saving" });

  try {
    const result = await api.completeLesson(lesson.id, state.mistakes);

    setCompletion({ status: "done", result });

    await refresh();

    try {
      const path = await api.getPath();
      const nextLesson = path.units
        .flatMap((unit) => unit.skills)
        .find(
          (skill) =>
            skill.status === "available" &&
            skill.next_lesson_id !== null,
        );

      setNextLessonId(nextLesson?.next_lesson_id ?? null);
    } catch {
      setNextLessonId(null);
    }
  } catch {
    setCompletion({ status: "error" });
  }
}

  function handleContinue() {
    if (state.phase !== "feedback") return;
    // last question answered correctly (a wrong answer would have added another one to the queue)
    const finishing = !state.result?.out_of_hearts && state.index + 1 >= state.queue.length;
    dispatch({ type: "CONTINUE" });
    if (finishing) void finishLesson();
  }

  async function handleRefill() {
    setRefilling(true);
    try {
      const updated = await api.refillHearts();
      setUser(updated);
      dispatch({ type: "RESTART", exercises: lesson.exercises, hearts: updated.hearts });
    } catch (e) {
      toast(e instanceof ApiError ? e.detail : "Could not refill hearts", "error");
    } finally {
      setRefilling(false);
    }
  }

  // ---------- Enter key = Check / Continue ----------
  // The listener is registered once; the ref always points at the newest handler.
  const enterHandler = useRef<() => void>(() => {});
  useEffect(() => {
    enterHandler.current = () => {
      if (state.phase === "feedback") handleContinue();
      else if (canCheck) handleCheck();
    };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;
      if ((e.target as HTMLElement).tagName === "BUTTON") return; // a focused button handles Enter itself
      e.preventDefault(); // no new line inside the typing box
      enterHandler.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------- screens ----------

  if (state.phase === "complete") {
    return (
      <LessonComplete
  completion={completion}
  accuracy={accuracy}
  nextLessonId={nextLessonId}
  onContinue={() =>
    router.push(nextLessonId ? `/lesson/${nextLessonId}` : "/learn")
  }
  onRetry={() => void finishLesson()}
/>
    );
  }

  const ExerciseView = EXERCISE_COMPONENTS[exercise.type];

  return (
    <div className="flex min-h-screen flex-col">
      <LessonHeader progress={progress} hearts={state.hearts} onQuit={() => setQuitOpen(true)} />

      <main className="mx-auto w-full max-w-[600px] flex-1 px-4 pb-8">
        {/* the key makes React start a fresh component (empty selection) for every question */}
        <ExerciseView
          key={`${state.index}-${exercise.id}`}
          exercise={exercise}
          disabled={state.phase !== "answering"}
          onAnswerChange={(answer) => dispatch({ type: "SET_ANSWER", answer })}
        />
      </main>

      <FeedbackBar
        phase={state.phase}
        result={state.result}
        canCheck={canCheck}
        successMessage={SUCCESS_MESSAGES[state.correctCount % SUCCESS_MESSAGES.length]}
        onCheck={handleCheck}
        onSkip={handleSkip}
        onContinue={handleContinue}
      />

      <QuitModal open={quitOpen} onKeepLearning={() => setQuitOpen(false)} onQuit={() => router.push("/learn")} />
      <OutOfHeartsModal
        open={state.phase === "failed"}
        gems={user?.gems ?? 0}
        refilling={refilling}
        onRefill={() => void handleRefill()}
        onPractice={() => toast("Practice mode is coming soon!")}
        onQuit={() => router.push("/learn")}
      />
    </div>
  );
}