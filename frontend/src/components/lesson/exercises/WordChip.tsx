import { cn } from "@/lib/cn";

interface WordChipProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  used?: boolean; // the chip is currently placed elsewhere: leave a grey "hole" so nothing jumps around
}

/** The little rounded word tile used by the word bank and fill-in-the-blank. */
export default function WordChip({ label, onClick, disabled, used }: WordChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || used}
      className={cn(
        "rounded-2xl border-2 border-b-4 px-4 py-2.5 text-[17px] font-bold transition-transform",
        used
          ? "border-swan bg-swan text-swan"
          : "border-swan bg-white text-eel enabled:hover:bg-polar enabled:active:translate-y-0.5 enabled:active:border-b-2",
      )}
    >
      {label}
    </button>
  );
}