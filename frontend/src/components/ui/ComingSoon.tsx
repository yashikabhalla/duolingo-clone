import Link from "next/link";

import { buttonClasses } from "./Button";
import Mascot from "./Mascot";

/** One reusable placeholder for every feature the assignment allows us to mock. */
export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="duo-idle">
        <Mascot size={140} />
      </div>

      <h1 className="text-2xl font-extrabold text-eel">{title}</h1>

      <p className="max-w-sm font-bold text-wolf">
        {description ?? "This feature is coming soon. Check back later!"}
      </p>

      <Link href="/learn" className={buttonClasses({ variant: "primary" })}>
        Back to learning
      </Link>
    </div>
  );
}