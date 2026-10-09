"use client";

import { useEffect, useState } from "react";

/**
 * Generic "load this once when the page opens" hook, so each page does not repeat the same
 * fetch / loading / error / retry code.  Pass a STABLE function (like `api.getLeaderboard`);
 * a function created inside the component would be a new one on every render and loop forever.
 */
export function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0); // bump to re-fetch

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, attempt]);

  const retry = () => {
    setData(null);
    setError(null);
    setAttempt((a) => a + 1);
  };

  return { data, error, loading: data === null && error === null, retry };
}