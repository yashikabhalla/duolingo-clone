import { cn } from "@/lib/cn";

// Only token colours (no hard-coded hex), so the avatars look right in both themes.
const COLORS = ["bg-macaw", "bg-beetle", "bg-fox", "bg-feather", "bg-cardinal"];

interface AvatarProps {
  name: string;
  seed: number; // e.g. the user id: the same person always gets the same colour
  size?: number;
}

/** Round avatar with the person's first letter. Stand-in for profile pictures. */
export default function Avatar({ name, seed, size = 48 }: AvatarProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-extrabold text-white", COLORS[seed % COLORS.length])}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}