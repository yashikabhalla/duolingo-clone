"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import type { DebugDay } from "@/lib/types";

/** Lets an evaluator test day-based features (streak, daily goal, hearts) without waiting 24 hours. */
export default function DevTools() {
  const { refresh } = useUser();
  const toast = useToast();
  const { data: initialDay } = useApi(api.getToday);
  const [advancedDay, setAdvancedDay] = useState<DebugDay | null>(null);
  const [busy, setBusy] = useState(false);

  const day = advancedDay ?? initialDay;

  async function simulateNextDay() {
    setBusy(true);
    try {
      const next = await api.advanceDay();
      setAdvancedDay(next);
      await refresh(); // streak flame, daily goal and hearts all depend on the date
      toast(`It's now ${next.simulated_date}`, "success");
    } catch {
      toast("Could not advance the day. Is the backend running?", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-extrabold">Developer tools</h2>
      <p className="mb-3 mt-1 font-bold text-wolf">
        Pretend a day has passed to test the streak, daily goal and hearts. Skip one day and the streak
        continues; skip two and it resets.
      </p>
      <p className="mb-4 font-extrabold">
        Simulated date:{" "}
        <span className="text-macaw">{day ? `${day.simulated_date} (+${day.day_offset} day${day.day_offset === 1 ? "" : "s"})` : "…"}</span>
      </p>
      <Button variant="blue" disabled={busy} onClick={() => void simulateNextDay()}>
        Simulate next day
      </Button>
    </Card>
  );
}