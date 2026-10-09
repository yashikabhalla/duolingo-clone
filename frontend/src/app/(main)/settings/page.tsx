import DevTools from "@/components/settings/DevTools";
import Card from "@/components/ui/Card";

// Placeholder rows: the assignment allows "Coming soon" for settings.
const PLACEHOLDER_SETTINGS = [
  { label: "Daily goal", hint: "Choose how much XP you want per day" },
  { label: "Notifications", hint: "Practice reminders" },
  { label: "Course language", hint: "Spanish is the only course for now" },
  { label: "Account", hint: "Email, password and sign-in" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-3xl font-black">Settings</h1>

      <Card className="divide-y-2 divide-swan p-0">
        {PLACEHOLDER_SETTINGS.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-extrabold">{row.label}</p>
              <p className="text-sm font-bold text-wolf">{row.hint}</p>
            </div>
            <span className="rounded-md bg-swan px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-wolf">
              Coming soon
            </span>
          </div>
        ))}
      </Card>

      <DevTools />
    </div>
  );
}