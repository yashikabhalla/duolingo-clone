"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/cn";

function Stat({ icon, value, color, dim }: { icon: string; value: string | number; color: string; dim?: boolean }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-lg font-extrabold", dim ? "text-hare" : color)}>
      <span className={cn("text-2xl", dim && "grayscale")}>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

/** Top bar: course flag, streak, gems, hearts. Reads everything from the shared user state. */
export default function StatsBar() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between gap-3">
      <Stat icon="🇪🇸" value="" color="text-eel" />
      {/* the flame is grey until you finish a lesson today, like the real app */}
      <Stat
        icon="🔥"
        value={user?.streak ?? "-"}
        color="text-fox"
        dim={!user?.streak_active_today}
      />
      <Stat icon="💎" value={user?.gems ?? "-"} color="text-macaw" />
      <Stat icon="❤️" value={user?.hearts ?? "-"} color="text-cardinal" dim={user?.hearts === 0} />
    </div>
  );
}