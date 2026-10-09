"use client";

import Link from "next/link";
import { useState } from "react";

const LANGUAGES = [
  { name: "Spanish", flag: "🇪🇸", available: true },
  { name: "French", flag: "🇫🇷", available: false },
  { name: "Italian", flag: "🇮🇹", available: false },
  { name: "Japanese", flag: "🇯🇵", available: false },
  { name: "Croatian", flag: "🇭🇷", available: false },
];

export default function CoursesPage() {
  const [message, setMessage] = useState("");

  function showComingSoon(language: string) {
    setMessage(`${language} course coming soon!`);

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  return (
    <main className="flex min-h-[calc(100vh-40px)] items-center justify-center px-6 py-6">
      <div className="w-full max-w-5xl">
       <div className="mx-auto mb-7 max-w-4xl">
  <h1 className="text-4xl font-black text-eel sm:text-5xl">
    Language Courses
  </h1>

  <p className="mt-2 font-bold text-wolf">
    Choose a language to start learning.
  </p>
</div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((language) => {
            if (language.available) {
              return (
                <Link
                  key={language.name}
                  href="/learn"
                  className="group flex min-h-[205px] flex-col items-center justify-center rounded-3xl border-2 border-swan bg-white p-5 text-center shadow-[0_5px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:border-feather hover:shadow-[0_8px_0_rgba(0,0,0,0.08)] dark:bg-[#202020]"
                >
                  <span
                    className="mb-4 text-6xl leading-none"
                    aria-hidden="true"
                  >
                    {language.flag}
                  </span>

                  <h2 className="text-lg font-black text-eel">
                    {language.name}
                  </h2>

                  <p className="mt-1 text-sm font-extrabold uppercase tracking-wider text-feather">
                    Start learning
                  </p>
                </Link>
              );
            }

            return (
              <button
                key={language.name}
                type="button"
                onClick={() => showComingSoon(language.name)}
                className="flex min-h-[205px] flex-col items-center justify-center rounded-3xl border-2 border-swan bg-white p-5 text-center shadow-[0_5px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.08)] dark:bg-[#202020]"
              >
                <span
                  className="mb-4 text-6xl leading-none"
                  aria-hidden="true"
                >
                  {language.flag}
                </span>

                <h2 className="text-lg font-black text-eel">
                  {language.name}
                </h2>

                <p className="mt-1 text-sm font-extrabold uppercase tracking-wider text-wolf">
                  Course coming soon
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {message && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-white px-6 py-4 text-sm font-extrabold text-[#202020] shadow-[0_5px_0_rgba(0,0,0,0.18)]">
          {message}
        </div>
      )}
    </main>
  );
}