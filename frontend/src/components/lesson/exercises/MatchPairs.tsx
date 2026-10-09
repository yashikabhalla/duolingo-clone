"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps, MatchData } from "./types";

// Each pair you make gets its own colour, shown on both tiles, so you can see what is linked.
const PAIR_COLORS = [
  "border-macaw bg-ice text-macaw",
  "border-beetle bg-[#f5e6ff] text-[#a568cc]",
  "border-fox bg-[#fff0d9] text-[#cc7900]",
  "border-feather bg-correct-bg text-feather-dark",
];

/**
 * Tap a word on the left, then its match on the right.
 * Spanish words on the right are automatically pronounced when selected.
 */
export default function MatchPairs({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const { left, right } = exercise.data as unknown as MatchData;
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  function update(next: Record<string, string>) {
    setPairs(next);
    onAnswerChange(Object.keys(next).length === left.length ? next : null);
  }

  function speakSpanish(word: string) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "es-ES";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  function clickLeft(word: string) {
    if (disabled) return;

    if (word in pairs) {
      const { [word]: removed, ...rest } = pairs;
      void removed;
      update(rest);
      setActiveLeft(null);
    } else {
      setActiveLeft(word === activeLeft ? null : word);
    }
  }

  function clickRight(word: string) {
    if (disabled) return;

    // Pronounce the Spanish word when it is selected.
    speakSpanish(word);

    const owner = Object.keys(pairs).find((l) => pairs[l] === word);

    if (owner) {
      const { [owner]: removed, ...rest } = pairs;
      void removed;
      update(rest);
      return;
    }

    if (activeLeft === null) return;

    update({ ...pairs, [activeLeft]: word });
    setActiveLeft(null);
  }

  function tileClass(colorIndex: number | null, active: boolean) {
    return cn(
      "w-full rounded-2xl border-2 border-b-4 p-4 text-center text-lg font-bold transition-colors",
      colorIndex !== null
        ? PAIR_COLORS[colorIndex % PAIR_COLORS.length]
        : active
          ? "border-macaw bg-ice text-macaw"
          : "border-swan bg-white text-eel enabled:hover:bg-polar",
    );
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex flex-col gap-3">
          {left.map((word, i) => (
            <button
              key={word}
              type="button"
              disabled={disabled}
              onClick={() => clickLeft(word)}
              className={tileClass(word in pairs ? i : null, activeLeft === word)}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {right.map((word) => {
            const owner = Object.keys(pairs).find((l) => pairs[l] === word);

            return (
              <button
                key={word}
                type="button"
                disabled={disabled}
                onClick={() => clickRight(word)}
                className={tileClass(owner ? left.indexOf(owner) : null, false)}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}