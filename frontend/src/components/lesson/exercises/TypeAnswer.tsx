"use client";

import { useEffect, useRef, useState } from "react";

import ExercisePrompt from "./ExercisePrompt";
import type { ExerciseProps } from "./types";

export default function TypeAnswer({ exercise, disabled, onAnswerChange }: ExerciseProps) {
  const [text, setText] = useState("");
  //creates a reference to the actual DOM textarea.
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // start typing immediately, like the real app
  }, []);

  return (
    <div>
      <ExercisePrompt>{exercise.prompt}</ExercisePrompt>
      <textarea
        ref={inputRef}//connects the React ref to the DOM element.
        value={text}//the textarea's displayed value comes from React state
        disabled={disabled}//prevents editing when the parent disables the exercise
        rows={4}
        lang="es"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Type in Spanish"
        onChange={(e) => {
          setText(e.target.value);//update local state
          onAnswerChange(e.target.value.trim() ? e.target.value : null);
        }}
        className="w-full resize-none rounded-2xl border-2 border-swan bg-polar p-4 text-lg font-bold text-eel outline-none placeholder:text-hare focus:border-macaw"
      />
    </div>
  );
}
