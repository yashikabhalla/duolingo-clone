"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps, FillBlankData } from "./types";
import WordChip from "./WordChip";

export default function FillBlank({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const { before, after, options } = exercise.data as unknown as FillBlankData;
  const [selected, setSelected] = useState<string | null>(null);

  function update(next: string | null) {
    setSelected(next);
    onAnswerChange(next);
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>

      {/* the sentence with a gap; tapping the filled gap puts the word back */}
      <p className="mb-8 text-2xl font-bold leading-[3rem]">
        {before}
        <button
          type="button"
          disabled={disabled || selected === null}
          onClick={() => update(null)}
          className={cn(
            "mx-1 inline-block min-w-[110px] border-b-2 px-2 text-center align-bottom",
            selected ? "rounded-xl border-2 border-swan bg-white text-eel" : "border-hare text-transparent",
          )}
        >
          {selected ?? "blank"}
        </button>
        {after}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {options.map((option) => (
          <WordChip
            key={option}
            label={option}
            disabled={disabled}
            used={selected === option}
            onClick={() => update(option)}
          />
        ))}
      </div>
    </div>
  );
}