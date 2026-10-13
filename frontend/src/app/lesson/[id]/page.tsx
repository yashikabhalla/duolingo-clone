import { Suspense } from "react";
//Suspense allows React to display a fallback UI while something inside is waiting/loading.
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
//The lesson ID comes dynamically from the URL and is read inside LessonScreen using useParams.
// Suspense provides a fallback UI while LessonScreen is being resolved.
