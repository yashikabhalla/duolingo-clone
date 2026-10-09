import type {
  Achievement,
  AnswerResult,
  AnswerValue,
  CompleteResult,
  DebugDay,
  LeaderboardEntry,
  Lesson,
  Path,
  User,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Thrown for any non-2xx response. `detail` is the backend's message, e.g. "out_of_hearts". */
export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store", // progress changes constantly, never serve a cached copy
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* response had no JSON body, keep statusText */
    }
    throw new ApiError(res.status, detail);
  }
  return (await res.json()) as T;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

/** One function per backend endpoint, all typed. Pages never call fetch() directly. */
export const api = {
  getUser: () => request<User>("/api/user"),
  getPath: () => request<Path>("/api/course/path"),
  getLesson: (lessonId: number) => request<Lesson>(`/api/lessons/${lessonId}`),
  submitAnswer: (lessonId: number, exerciseId: number, answer: AnswerValue) =>
    post<AnswerResult>(`/api/lessons/${lessonId}/answer`, { exercise_id: exerciseId, answer }),
  completeLesson: (lessonId: number, mistakes: number) =>
    post<CompleteResult>(`/api/lessons/${lessonId}/complete`, { mistakes }),
  refillHearts: () => post<User>("/api/hearts/refill"),
  getLeaderboard: () => request<LeaderboardEntry[]>("/api/leaderboard"),
  getAchievements: () => request<Achievement[]>("/api/achievements"),
  advanceDay: () => post<DebugDay>("/api/debug/advance-day"),
};