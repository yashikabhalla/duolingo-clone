import { Suspense } from "react";

import LessonScreen from "@/components/lesson/LessonScreen";
import Mascot from "@/components/ui/Mascot";

// The lesson id comes from the URL, which Next.js only knows at request time. Reading it
// (useParams in LessonScreen) must therefore sit inside <Suspense>, with a fallback to show meanwhile.
export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Mascot size={110} className="animate-float" />
        </div>
      }
    >
      <LessonScreen />
    </Suspense>
  );
}