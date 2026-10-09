"use client";

import { useState } from "react";

import Mascot from "@/components/ui/Mascot";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps, TranslateData } from "./types";
import WordChip from "./WordChip";

/** Word-bank translation: tap words to build the sentence, tap them again to take them back. */
export default function Translate({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const { sentence, word_bank } = exercise.data as unknown as TranslateData;
  // We store INDEXES into the bank (not the words) so two identical words can never get mixed up.
  const [picked, setPicked] = useState<number[]>([]);

  function update(next: number[]) {
    setPicked(next);
    onAnswerChange(next.length > 0 ? next.map((i) => word_bank[i]) : null);
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>

      <div className="mb-6 flex items-center gap-4">
        <Mascot size={96} className="shrink-0" />
        <div className="rounded-2xl border-2 border-swan px-4 py-3 text-lg font-bold">{sentence}</div>
      </div>

      {/* answer area: two faint writing lines with the chosen words on top */}
      <div className="relative mb-6 flex min-h-[120px] flex-wrap content-start gap-2 border-y-2 border-swan py-3">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 bg-swan" />
        {picked.map((bankIndex) => (
          <div key={bankIndex} className="relative">
            <WordChip
              label={word_bank[bankIndex]}
              disabled={disabled}
              onClick={() => update(picked.filter((i) => i !== bankIndex))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {word_bank.map((word, i) => (
          <WordChip
            key={i}
            label={word}
            disabled={disabled}
            used={picked.includes(i)}
            onClick={() => update([...picked, i])}
          />
        ))}
      </div>
    </div>
  );
}