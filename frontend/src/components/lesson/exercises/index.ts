import type { ComponentType } from "react";

import type { ExerciseType } from "@/lib/types";

import FillBlank from "./FillBlank";
import MatchPairs from "./MatchPairs";
import MultipleChoice from "./MultipleChoice";
import Translate from "./Translate";
import TypeAnswer from "./TypeAnswer";
import type { ExerciseProps } from "./types";

/** The only place that knows which component draws which exercise type.
 *  A sixth exercise type = write one component + add one line here. */
export const EXERCISE_COMPONENTS: Record<ExerciseType, ComponentType<ExerciseProps>> = {
  multiple_choice: MultipleChoice,
  fill_blank: FillBlank,
  translate: Translate,
  match_pairs: MatchPairs,
  type_answer: TypeAnswer,
};