const COLORS = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];

/** Falling confetti. Positions come from the index (not Math.random) so it is identical on every render. */
export default function Confetti({ pieces = 36 }: { pieces?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          className="animate-confetti absolute -top-4 block h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${(i % 9) * 0.18}s`,
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}