"use client";

import { useState } from "react";

import Button, { type ButtonVariant } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Mascot from "@/components/ui/Mascot";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "blue", "danger", "danger-outline", "ghost"];

const SWATCHES: Array<[string, string]> = [
  ["feather", "bg-feather"],
  ["feather-dark", "bg-feather-dark"],
  ["macaw", "bg-macaw"],
  ["cardinal", "bg-cardinal"],
  ["fox", "bg-fox"],
  ["bee", "bg-bee"],
  ["beetle", "bg-beetle"],
  ["eel", "bg-eel"],
  ["wolf", "bg-wolf"],
  ["hare", "bg-hare"],
  ["swan", "bg-swan"],
  ["ice", "bg-ice"],
];

// A visual test page for the design system: handy for checking components, and a nice thing to
// show in the interview. It is not linked from the app navigation.
export default function DesignPage() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(40);
  const toast = useToast();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-black">Design system</h1>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Buttons (press them!)</h2>
        <div className="flex flex-wrap items-center gap-4">
          {VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Progress bar</h2>
        <div className="flex flex-col gap-3">
          <ProgressBar value={progress} />
          <ProgressBar value={progress} color="yellow" label={`${Math.round(progress / 10)} / 10`} />
          <div className="flex gap-3">
            <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 20))}>
              -20%
            </Button>
            <Button size="sm" onClick={() => setProgress((p) => Math.min(100, p + 20))}>
              +20%
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Modal and toasts</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => toast("Lesson saved!", "success")}>
            Success toast
          </Button>
          <Button variant="secondary" onClick={() => toast("Something went wrong", "error")}>
            Error toast
          </Button>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col items-center gap-3">
            <Mascot size={110} />
            <h3 className="text-2xl font-extrabold">Nice work!</h3>
            <p className="font-bold text-wolf">This is the shared Modal component.</p>
            <Button fullWidth onClick={() => setOpen(false)}>
              Continue
            </Button>
          </div>
        </Modal>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Colors</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {SWATCHES.map(([name, cls]) => (
            <Card key={name} className="p-2">
              <div className={`h-12 rounded-lg ${cls}`} />
              <p className="mt-1 text-xs font-extrabold">{name}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}