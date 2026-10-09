import Link from "next/link";

import Mascot from "@/components/ui/Mascot";
import { cn } from "@/lib/cn";
import type { Skill } from "@/lib/types";

import type { UnitTheme } from "./unitThemes";

const RING_SIZE = 96;
const RING_RADIUS = 44;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS; // length of the circle's outline

/** Circular progress ring drawn around the available node: crowns earned / lessons in the skill. */
function ProgressRing({ fraction, color }: { fraction: number; color: string }) {
  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="absolute inset-0 -rotate-90" // rotate so the ring starts at 12 o'clock
      aria-hidden="true"
    >
      <circle cx={48} cy={48} r={RING_RADIUS} fill="none" stroke="#e5e5e5" strokeWidth={6} />
      {fraction > 0 && (
        <circle
          cx={48}
          cy={48}
          r={RING_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          // dash pattern "drawn gap": draw `fraction` of the outline, then leave the rest empty
          strokeDasharray={`${fraction * RING_LENGTH} ${RING_LENGTH}`}
        />
      )}
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-8 w-8", className)} aria-hidden="true">
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l5 5L19.5 7" />
    </svg>
  );
}

interface SkillNodeProps {
  skill: Skill;
  theme: UnitTheme;
  offset: number; // horizontal shift in px, this is what makes the path zig-zag
  isCurrent: boolean; // the skill the learner should do next
  open: boolean; // is this node's popover showing?
  onToggle: () => void;
}

export default function SkillNode({ skill, theme, offset, isCurrent, open, onToggle }: SkillNodeProps) {
  const { status } = skill;
  const locked = status === "locked";
  const completed = status === "completed";

  // colours per state: locked = grey, completed = gold, available = the unit's colour
  const nodeStyle = locked
    ? "bg-swan shadow-[0_8px_0_#b7b7b7]"
    : completed
      ? "bg-bee shadow-[0_8px_0_#e5b400]"
      : cn(theme.node, theme.nodeShadow);

  const popoverBg = locked ? "bg-swan" : completed ? "bg-bee" : theme.node;
  const fraction = skill.total_lessons > 0 ? skill.crowns / skill.total_lessons : 0;

  return (
    <div className="relative flex w-full justify-center py-1.5">
      <div className="relative h-24 w-24" style={{ transform: `translateX(${offset}px)` }}>
        {/* floating START bubble above the current node */}
        {isCurrent && !open && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2">
            <div className="animate-float">
              <div
                className={cn(
                  "relative rounded-xl border-2 border-swan bg-white px-3 py-1.5 text-sm font-extrabold uppercase tracking-wider",
                  theme.text,
                )}
              >
                Start
                <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-swan bg-white" />
              </div>
            </div>
          </div>
        )}

        {!locked && !completed && <ProgressRing fraction={fraction} color={theme.ring} />}

        <button
          type="button"
          aria-label={`${skill.title}, ${status}`}
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation(); // otherwise the page's "click outside closes popover" would fire
            onToggle();
          }}
          className={cn(
            "absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-[calc(50%+4px)] items-center justify-center rounded-full",
            "transition-[transform,box-shadow] duration-100 active:translate-y-[calc(-50%+4px)] active:shadow-none",
            nodeStyle,
          )}
        >
          {completed ? <CheckIcon /> : <StarIcon className={locked ? "text-[#b7b7b7]" : "text-white"} />}
        </button>

       {isCurrent && (
  <div
    className={cn(
      "absolute top-[145%] hidden -translate-y-1/2 sm:block",
      offset > 0 ? "right-full mr-20" : "left-full ml-20",
    )}
  >
    <div className="duo-idle">
      <Mascot size={96} />
    </div>
  </div>
)}
      </div>

      {open && (
        <div
          className={cn(
            "absolute left-1/2 top-full z-20 w-[260px] -translate-x-1/2 rounded-2xl p-4 text-left",
            popoverBg,
            locked ? "text-eel" : "text-white",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* little arrow pointing at the node, shifted by the same offset as the node */}
          <span
            className={cn("absolute -top-2 h-4 w-4 rotate-45 rounded-sm", popoverBg)}
            style={{ left: `calc(50% + ${offset - 8}px)` }}
          />
          <h3 className="text-lg font-extrabold">
            {skill.icon} {skill.title}
          </h3>
          <p className={cn("mb-3 text-[15px] font-bold", locked ? "text-wolf" : "text-white/90")}>
            {locked
              ? "Complete all levels above to unlock this!"
              : completed
                ? `All ${skill.total_lessons} lessons complete`
                : `Lesson ${skill.crowns + 1} of ${skill.total_lessons}`}
          </p>
          {!locked && skill.next_lesson_id !== null && (
            <Link
              href={`/lesson/${skill.next_lesson_id}`}
              className={cn(
                "block rounded-2xl bg-white py-3 text-center text-[15px] font-extrabold uppercase tracking-wider",
                "shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none",
                completed ? "text-[#e5b400]" : theme.text,
              )}
            >
              {completed ? "Practice" : "Start"}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}