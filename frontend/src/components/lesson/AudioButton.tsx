"use client";

import { useEffect } from "react";

interface AudioButtonProps {
  text: string;
  language?: string;
  label?: string;
}

export default function AudioButton({
  text,
  language = "es-ES",
  label = "Listen",
}: AudioButtonProps) {
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`${label}: ${text}`}
      className="inline-flex items-center gap-2 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-2.5 font-bold text-sky-700 transition hover:bg-sky-100 active:scale-95"
    >
      <span className="text-xl" aria-hidden="true">
        🔊
      </span>
      <span>{label}</span>
    </button>
  );
}