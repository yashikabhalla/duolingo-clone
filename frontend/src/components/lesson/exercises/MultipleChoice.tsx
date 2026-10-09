"use client";

import { useState } from "react";

import ExercisePrompt from "./ExercisePrompt";
import OptionCard from "./OptionCard";
import type { ExerciseProps, OptionsData } from "./types";

export default function MultipleChoice({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const { options } = exercise.data as unknown as OptionsData;
  const [selected, setSelected] = useState<string | null>(null);

  function choose(option: string) {
    if (disabled) return;
    setSelected(option);
    onAnswerChange(option);
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>
      <div className="flex flex-col gap-3">
        {options.map((option, i) => (
          <OptionCard
            key={option}
            label={option}
            hint={i + 1}
            selected={selected === option}
            disabled={disabled}
            onSelect={() => choose(option)}
          />
        ))}
      </div>
    </div>
  );
}