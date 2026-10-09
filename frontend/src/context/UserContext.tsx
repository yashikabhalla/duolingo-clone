"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { api } from "@/lib/api";
import type { User } from "@/lib/types";

interface UserContextValue {
  user: User | null; // null while the first request is in flight
  error: string | null;
  refresh: () => Promise<void>; // re-fetch from the backend (call after a lesson, refill, ...)
  setUser: (user: User) => void; // for when an API response already contains the new user
}

const UserContext = createContext<UserContextValue | null>(null);

/** Holds the learner's stats once, so the top bar, side panel and lesson screen all share them. */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setUser(await api.getUser());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load user");
    }
  }, []);

  // First load. The state updates happen inside .then/.catch callbacks (after the request
  // finishes), never synchronously in the effect body, which keeps React happy.
  useEffect(() => {
    let cancelled = false;
    api
      .getUser()
      .then((u) => !cancelled && setUser(u))
      .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Could not load user"));
    return () => {
      cancelled = true; // ignore the response if the component unmounted meanwhile
    };
  }, []);

  return <UserContext.Provider value={{ user, error, refresh, setUser }}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}