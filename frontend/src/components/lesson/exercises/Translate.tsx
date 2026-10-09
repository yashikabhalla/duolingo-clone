"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import Mascot from "@/components/ui/Mascot";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps, TranslateData } from "./types";
import WordChip from "./WordChip";

/** Word-bank translation: tap words to build the sentence, tap them again to take them back. */
export default function Translate({
  exercise,
  disabled,
  onAnswerChange,
}: ExerciseProps) {
  const { sentence, word_bank } = exercise.data as unknown as TranslateData;
  const [picked, setPicked] = useState<number[]>([]);

  function speakSpanish(word: string) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "es-ES";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  function update(next: number[]) {
    setPicked(next);
    onAnswerChange(
      next.length > 0 ? next.map((i) => word_bank[i]) : null
    );
  }

  function selectWord(index: number) {
    if (disabled) return;

    // Automatically pronounce the Spanish word when selected.
    speakSpanish(word_bank[index]);

    update([...picked, index]);
  }

  function removeWord(index: number) {
    if (disabled) return;

    update(picked.filter((i) => i !== index));
  }

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>

      <div className="mb-6 flex items-center gap-4">
        <Mascot size={96} className="shrink-0" />

        <div className="flex flex-1 flex-col items-start gap-3">
          <div className="rounded-2xl border-2 border-swan px-4 py-3 text-lg font-bold">
            {sentence}
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div className="relative mb-6 flex min-h-[120px] flex-wrap content-start gap-2 border-y-2 border-swan py-3">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 bg-swan" />

        {picked.map((bankIndex) => (
          <div key={bankIndex} className="relative">
            <WordChip
              label={word_bank[bankIndex]}
              disabled={disabled}
              onClick={() => removeWord(bankIndex)}
            />
          </div>
        ))}
      </div>

      {/* Spanish word bank */}
      <div className="flex flex-wrap justify-center gap-2">
        {word_bank.map((word, i) => (
          <WordChip
            key={i}
            label={word}
            disabled={disabled}
            used={picked.includes(i)}
            onClick={() => selectWord(i)}
          />
        ))}
      </div>
    </div>
  );
}