/** A simple original owl drawn in SVG, used as the "mascot flourish" on empty states and modals. */
export default function Mascot({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden="true">
      <ellipse cx="60" cy="113" rx="30" ry="6" fill="#000" opacity="0.08" />
      <path d="M30 22 L40 38 L22 36 Z M90 22 L80 38 L98 36 Z" fill="#58a700" />
      <path d="M22 52 Q22 14 60 14 Q98 14 98 52 L98 84 Q98 109 60 109 Q22 109 22 84 Z" fill="#58cc02" />
      <ellipse cx="60" cy="89" rx="26" ry="18" fill="#89e219" />
      <circle cx="42" cy="52" r="17" fill="#fff" />
      <circle cx="78" cy="52" r="17" fill="#fff" />
      <circle cx="45" cy="54" r="7" fill="#4b4b4b" />
      <circle cx="75" cy="54" r="7" fill="#4b4b4b" />
      <circle cx="47" cy="51" r="2.5" fill="#fff" />
      <circle cx="77" cy="51" r="2.5" fill="#fff" />
      <path d="M52 66 L68 66 L60 78 Z" fill="#ffc800" />
    </svg>
  );
}