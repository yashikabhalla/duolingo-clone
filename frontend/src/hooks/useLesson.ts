"use client";

import { useEffect, useState } from "react";

import { ApiError, api } from "@/lib/api";
import type { Lesson } from "@/lib/types";

/** Loads one lesson. `errorCode` is the backend's reason, e.g. "out_of_hearts" or "skill_locked". */
export function useLesson(lessonId: number) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!Number.isInteger(lessonId)) return; // bad URL like /lesson/abc: handled below
    let cancelled = false;
    api
      .getLesson(lessonId)
      .then((l) => {
        if (!cancelled) setLesson(l);
      })
      .catch((e: unknown) => {
        if (!cancelled) setErrorCode(e instanceof ApiError ? e.detail : "network_error");
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId, attempt]);

  const reload = () => {
    setLesson(null);
    setErrorCode(null);
    setAttempt((a) => a + 1);
  };

  const invalid = !Number.isInteger(lessonId);
  return {
    lesson,
    errorCode: invalid ? "lesson_not_found" : errorCode,
    loading: !invalid && lesson === null && errorCode === null,
    reload,
  };
}