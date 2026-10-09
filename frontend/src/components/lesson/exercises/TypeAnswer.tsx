"use client";

import { useEffect, useRef, useState } from "react";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps } from "./types";

export default function TypeAnswer({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // start typing immediately, like the real app
  }, []);

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>
      <textarea
        ref={inputRef}
        value={text}
        disabled={disabled}
        rows={4}
        lang="es"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Type in Spanish"
        onChange={(e) => {
          setText(e.target.value);
          onAnswerChange(e.target.value.trim() ? e.target.value : null);
        }}
        className="w-full resize-none rounded-2xl border-2 border-swan bg-polar p-4 text-lg font-bold text-eel outline-none placeholder:text-hare focus:border-macaw"
      />
    </div>
  );
}