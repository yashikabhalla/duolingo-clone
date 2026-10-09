"use client";

import { useEffect, useState } from "react";

import SkillNode from "@/components/path/SkillNode";
import UnitBanner from "@/components/path/UnitBanner";
import { themeForUnit } from "@/components/path/unitThemes";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { usePath } from "@/hooks/usePath";
import { cn } from "@/lib/cn";

// Horizontal shifts (px) applied to consecutive nodes, repeating. This is the "snake" shape.
const OFFSETS = [0, 48, 72, 48, 0, -48, -72, -48];

function PathSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center gap-6" aria-label="Loading path">
      <div className="h-[84px] w-full rounded-2xl bg-swan" />
      {[0, 48, 72, 48].map((x, i) => (
        <div key={i} className="h-[70px] w-[70px] rounded-full bg-swan" style={{ transform: `translateX(${x}px)` }} />
      ))}
    </div>
  );
}

export default function LearnPage() {
  const { path, error, loading, retry } = usePath();
  const [openSkillId, setOpenSkillId] = useState<number | null>(null);
  const toast = useToast();

  // Close the open popover on any outside click or Escape. (SkillNode stops propagation
  // for clicks on its own button/popover, so those never reach this listener.)
  useEffect(() => {
    if (openSkillId === null) return;
    const close = () => setOpenSkillId(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSkillId]);

  if (loading) return <PathSkeleton />;

  if (error || !path) {
    return (
      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-lg font-extrabold">We couldn&apos;t load your path</p>
        <p className="font-bold text-wolf">{error}</p>
        <Button onClick={retry}>Try again</Button>
      </Card>
    );
  }

  // Position of every skill in the whole course (0, 1, 2 ...) so the snake continues across units.
  const allSkills = path.units.flatMap((u) => u.skills);
  const positionById = new Map(allSkills.map((s, i) => [s.id, i]));
  // "Current" = the first skill that is available (not locked, not finished yet).
  const currentSkillId = allSkills.find((s) => s.status === "available")?.id;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {path.units.map((unit, unitIndex) => {
        const theme = themeForUnit(unitIndex);
        const unitDone = unit.skills.every((s) => s.status === "completed");

        return (
          <section key={unit.id}>
            <UnitBanner
              label={`Section 1, Unit ${unitIndex + 1}`}
              title={unit.title}
              theme={theme}
              onGuidebook={() => toast("The guidebook is coming soon!")}
            />

            <div className="flex flex-col items-center pt-14">
              {unit.skills.map((skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  theme={theme}
                  offset={OFFSETS[(positionById.get(skill.id) ?? 0) % OFFSETS.length]}
                  isCurrent={skill.id === currentSkillId}
                  open={openSkillId === skill.id}
                  onToggle={() => setOpenSkillId((id) => (id === skill.id ? null : skill.id))}
                />
              ))}

              {/* unit-end reward chest: decoration only, greyed out until the unit is finished */}
              <span className={cn("mt-4 text-6xl", !unitDone && "opacity-50 grayscale")} aria-hidden="true">
                🎁
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
}