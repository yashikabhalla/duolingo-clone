import ProgressBar from "@/components/ui/ProgressBar";

interface LessonHeaderProps {
  progress: number; // 0 - 100
  hearts: number;
  onQuit: () => void;
}

/** Top row of the lesson: X to quit, the progress bar, and the hearts you have left. */
export default function LessonHeader({ progress, hearts, onQuit }: LessonHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-[1000px] items-center gap-4 px-4 py-6 sm:gap-6">
      <button type="button" onClick={onQuit} aria-label="Quit lesson" className="text-hare hover:text-wolf">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
        </svg>
      </button>
      <ProgressBar value={progress} className="flex-1" />
      <div className="flex items-center gap-1.5 text-lg font-extrabold text-cardinal" aria-label={`${hearts} hearts left`}>
        <span className="text-2xl" aria-hidden="true">
          ❤️
        </span>
        {hearts}
      </div>
    </header>
  );
}