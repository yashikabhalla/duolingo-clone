import { cn } from "@/lib/cn";
//It creates one selectable answer option
interface OptionCardProps {
  label: string;//Answer text
  hint: number; // the little 1 / 2 / 3 badge
  selected: boolean;//Whether this option is currently selected
  disabled: boolean;//Whether user can click it
  onSelect: () => void;//Function to execute when clicked
}

/** A big tappable answer row: grey outline normally, blue when selected. */
export default function OptionCard({ label, hint, selected, disabled, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 border-b-4 p-4 text-left text-lg font-bold transition-colors",
        selected ? "border-macaw bg-ice text-macaw" : "border-swan bg-white text-eel enabled:hover:bg-polar",
        disabled && !selected && "cursor-default",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-extrabold",
          selected ? "border-macaw text-macaw" : "border-swan text-hare",
        )}
      >
        {hint}
      </span>
      {label}
    </button>
  );
}
