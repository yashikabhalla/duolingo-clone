import Card from "@/components/ui/Card";

/** One number with an icon, e.g. "🔥 2 Day streak". */
export default function StatTile({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-xl font-extrabold leading-tight">{value}</p>
        <p className="text-sm font-bold text-wolf">{label}</p>
      </div>
    </Card>
  );
}