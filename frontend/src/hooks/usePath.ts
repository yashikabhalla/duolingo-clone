"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Path } from "@/lib/types";

/** Loads the learning path from the backend. Returns the data, an error message, and a retry(). */
export function usePath() {
  const [path, setPath] = useState<Path | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0); // bump this number to trigger a re-fetch

  useEffect(() => {
    let cancelled = false;
    api
      .getPath()
      .then((p) => {
        if (!cancelled) setPath(p);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load the path");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setError(null);
    setPath(null);
    setAttempt((a) => a + 1);
  };

  return { path, error, loading: path === null && error === null, retry };
}