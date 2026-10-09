import type { AnswerValue, Exercise } from "@/lib/types";

/** Every exercise component takes exactly these props, so the player can treat them all alike.
 *  An exercise keeps its own selection in local state and reports it upward through onAnswerChange
 *  (null = "nothing usable chosen yet", which keeps the CHECK button disabled). */
export interface ExerciseProps {
  exercise: Exercise;
  disabled: boolean; // true once the answer has been submitted
  onAnswerChange: (answer: AnswerValue | null) => void;
}

// The JSON `data` column has a different shape per exercise type (see seed.py + presentation.py)
export interface OptionsData {
  options: string[];
}
export interface FillBlankData extends OptionsData {
  before: string;
  after: string;
}
export interface TranslateData {
  sentence: string;
  word_bank: string[];
}
export interface MatchData {
  left: string[];
  right: string[];
}