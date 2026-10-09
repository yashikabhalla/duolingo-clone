import Link from "next/link";

import Mascot from "@/components/ui/Mascot";
import { buttonClasses } from "@/components/ui/Button";

const LANGUAGES = [
  { flag: "🇪🇸", name: "Spanish" },
  { flag: "🇫🇷", name: "French" },
  { flag: "🇮🇹", name: "Italian" },
  { flag: "🇯🇵", name: "Japanese" },
  { flag: "🇭🇷", name: "Croatian" },
];

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-white">
      <header className="border-b-2 border-swan">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-feather"
          >
            <Mascot size={38} />
            Duolingo
          </Link>

          <Link
            href="/courses"
            className="text-sm font-extrabold uppercase tracking-wider text-wolf transition hover:text-feather"
          >
            Courses
          </Link>
        </div>
      </header>

      <section className="flex h-[calc(100vh-70px)] flex-col items-center justify-center px-6 text-center">
        <div className="duo-idle mb-5">
          <Mascot size={145} />
        </div>

        <h1 className="max-w-2xl text-3xl font-black leading-tight text-eel sm:text-4xl lg:text-5xl">
          Learn, practice and master new languages with Duolingo
        </h1>

        <p className="mt-4 max-w-lg text-base font-bold leading-relaxed text-wolf sm:text-lg">
          Build your skills one lesson at a time and make learning a daily
          habit.
        </p>

        <Link
          href="/courses"
          className={`${buttonClasses({
            variant: "primary",
          })} mt-6 min-w-[230px] text-center`}
        >
          Continue Learning
        </Link>

        {/* Language strip */}
        <div className="mt-12 w-full border-y-2 border-swan">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 px-4 py-5 sm:gap-12 lg:gap-16">
            {LANGUAGES.map((language) => (
              <div
                key={language.name}
                className="flex items-center gap-2 text-wolf"
              >
                <span className="text-2xl sm:text-3xl" aria-hidden="true">
                  {language.flag}
                </span>

                <span className="hidden text-sm font-extrabold uppercase tracking-wide sm:block">
                  {language.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}