"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import LessonPlayer from "@/components/lesson/LessonPlayer";
import OutOfHeartsModal from "@/components/lesson/OutOfHeartsModal";
import Button, { buttonClasses } from "@/components/ui/Button";
import Mascot from "@/components/ui/Mascot";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import { useLesson } from "@/hooks/useLesson";
import { ApiError, api } from "@/lib/api";

function Message({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Mascot size={130} />
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="max-w-sm font-bold text-wolf">{text}</p>
      {action}
      <Link href="/learn" className={buttonClasses({ variant: "secondary" })}>
        Back to learning
      </Link>
    </div>
  );
}

/** Loads the lesson, then hands it to the player. Also handles every way loading can fail. */
export default function LessonScreen() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { user, setUser } = useUser();
  const { lesson, errorCode, loading, reload } = useLesson(Number(params.id));
  const [refilling, setRefilling] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Mascot size={110} className="animate-float" />
      </div>
    );
  }

  if (lesson) return <LessonPlayer key={lesson.id} lesson={lesson} />;

  // The backend refused to start the lesson: no hearts left
  if (errorCode === "out_of_hearts") {
    return (
      <div className="min-h-screen">
        <OutOfHeartsModal
          open
          gems={user?.gems ?? 0}
          refilling={refilling}
          onRefill={async () => {
            setRefilling(true);
            try {
              setUser(await api.refillHearts());
              reload(); // hearts are back, so try opening the lesson again
            } catch (e) {
              toast(e instanceof ApiError ? e.detail : "Could not refill hearts", "error");
            } finally {
              setRefilling(false);
            }
          }}
          onPractice={() => toast("Practice mode is coming soon!")}
          onQuit={() => router.push("/learn")}
        />
      </div>
    );
  }

  if (errorCode === "skill_locked") {
    return <Message title="This skill is locked" text="Finish the skills above it to unlock this one." />;
  }
  if (errorCode === "lesson_not_found") {
    return <Message title="Lesson not found" text="We couldn't find that lesson." />;
  }
  return (
    <Message
      title="Something went wrong"
      text="We couldn't load this lesson. Is the backend running?"
      action={<Button onClick={reload}>Try again</Button>}
    />
  );
}