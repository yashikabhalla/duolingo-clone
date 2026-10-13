"use client";

import { useState } from "react";

import ExercisePrompt from "./ExercisePrompt";
import OptionCard from "./OptionCard";
import type { ExerciseProps, OptionsData } from "./types";

export default function MultipleChoice({
  exercise,//question + options
  disabled,//whether user can select
  onAnswerChange,//callback to parent
}: ExerciseProps) {
  const { options } = exercise.data as unknown as OptionsData;
  const [selected, setSelected] = useState<string | null>(null);

  function choose(option: string) {
    if (disabled) return;

    setSelected(option);//update local state
    onAnswerChange(option);//parent can then store the answer and eventually submit it to the backend.

    // Automatically pronounce the selected option
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(option);
      utterance.lang = "es-ES";
      utterance.rate = 0.85;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>

      <div className="flex flex-col gap-3">
        {options.map((option, i) => (//rendering all options
          <OptionCard//creates the option cards
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
