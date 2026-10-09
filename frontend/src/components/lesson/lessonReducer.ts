import type { AnswerResult, AnswerValue, Exercise } from "@/lib/types";

/**
 * The lesson is a small state machine. Only these transitions are possible:
 *
 *   answering --CHECK_STARTED--> checking --CHECK_DONE--> feedback --CONTINUE--> answering (next question)
 *                                    |                        |                       or complete (last one right)
 *                                    +--CHECK_FAILED--> answering      or failed (out of hearts)
 *
 * A reducer keeps every rule in one place and makes each transition easy to test and explain.
 */
export type Phase = "answering" | "checking" | "feedback" | "complete" | "failed";

export interface LessonState {
  queue: Exercise[]; // exercises to do, in order. Wrong ones are appended again at the end
  index: number; // which entry of `queue` we are on
  total: number; // number of ORIGINAL exercises (the progress bar's denominator)
  phase: Phase;
  answer: AnswerValue | null; // what the learner has picked/typed so far
  result: AnswerResult | null; // the server's verdict for the current question
  hearts: number;
  mistakes: number;
  correctCount: number; // how many exercises have been answered correctly
}

export type LessonAction =
  | { type: "SET_ANSWER"; answer: AnswerValue | null }
  | { type: "CHECK_STARTED" }
  | { type: "CHECK_FAILED" } // network error: let the learner try again
  | { type: "CHECK_DONE"; result: AnswerResult }
  | { type: "CONTINUE" }
  | { type: "RESTART"; exercises: Exercise[]; hearts: number };

export function createInitialState(exercises: Exercise[], hearts: number): LessonState {
  return {
    queue: exercises,
    index: 0,
    total: exercises.length,
    phase: "answering",
    answer: null,
    result: null,
    hearts,
    mistakes: 0,
    correctCount: 0,
  };
}

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "SET_ANSWER":
      if (state.phase !== "answering") return state;
      return { ...state, answer: action.answer };

    case "CHECK_STARTED":
      if (state.phase !== "answering") return state;
      return { ...state, phase: "checking" };

    case "CHECK_FAILED":
      if (state.phase !== "checking") return state;
      return { ...state, phase: "answering" };

    case "CHECK_DONE": {
      if (state.phase !== "checking") return state;
      const { result } = action;
      return {
        ...state,
        phase: "feedback",
        result,
        hearts: result.hearts,
        correctCount: state.correctCount + (result.correct ? 1 : 0),
        mistakes: state.mistakes + (result.correct ? 0 : 1),
        // wrong answer -> the same exercise comes back at the end of the lesson
        queue: result.correct ? state.queue : [...state.queue, state.queue[state.index]],
      };
    }

    case "CONTINUE": {
      if (state.phase !== "feedback") return state;
      if (state.result?.out_of_hearts) return { ...state, phase: "failed" };
      const next = state.index + 1;
      if (next >= state.queue.length) return { ...state, phase: "complete" };
      return { ...state, index: next, phase: "answering", answer: null, result: null };
    }

    case "RESTART":
      return createInitialState(action.exercises, action.hearts);
  }
}