// These types mirror backend/app/schemas.py. If a response shape changes there, change it here.

export interface User {
  id: number;
  name: string;
  total_xp: number;
  streak: number;
  streak_active_today: boolean;
  hearts: number;
  max_hearts: number;
  seconds_until_next_heart: number | null;
  gems: number;
  daily_goal_xp: number;
  today_xp: number;
  daily_goal_met: boolean;
  lessons_completed: number;
}

export type SkillStatus = "locked" | "available" | "completed";

export interface Skill {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  status: SkillStatus;
  crowns: number;
  total_lessons: number;
  next_lesson_id: number | null;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  order_index: number;
  skills: Skill[];
}

export interface Path {
  course_id: number;
  language: string;
  title: string;
  units: Unit[];
}

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface Exercise {
  id: number;
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>; // shape depends on `type`, see the seed script
  order_index: number;
}

export interface Lesson {
  id: number;
  skill_id: number;
  skill_title: string;
  xp_reward: number;
  hearts: number;
  exercises: Exercise[];
}

/** string = multiple choice / fill blank / type answer, string[] = translate, object = match pairs */
export type AnswerValue = string | string[] | Record<string, string>;

export interface AnswerResult {
  correct: boolean;
  correct_answer: string;
  hearts: number;
  out_of_hearts: boolean;
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at: string | null;
}

export interface CompleteResult {
  xp_earned: number;
  total_xp: number;
  streak: number;
  today_xp: number;
  daily_goal_xp: number;
  daily_goal_just_met: boolean;
  skill_completed: boolean;
  crowns: number;
  total_lessons: number;
  new_achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  weekly_xp: number;
  is_me: boolean;
}

export interface DebugDay {
  day_offset: number;
  simulated_date: string;
}