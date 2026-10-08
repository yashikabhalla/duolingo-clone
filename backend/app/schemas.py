"""Pydantic models = the exact JSON shape of every request and response.
FastAPI uses them to validate input, filter output and build the /docs page."""
from datetime import date, datetime
from typing import Literal, Union

from pydantic import BaseModel, ConfigDict, Field


# ----- user -----
class UserOut(BaseModel):
    id: int
    name: str
    total_xp: int
    streak: int
    streak_active_today: bool
    hearts: int
    max_hearts: int
    seconds_until_next_heart: int | None
    gems: int
    daily_goal_xp: int
    today_xp: int
    daily_goal_met: bool
    lessons_completed: int


# ----- path -----
class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    order_index: int
    status: Literal["locked", "available", "completed"]
    crowns: int
    total_lessons: int
    next_lesson_id: int | None


class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    order_index: int
    skills: list[SkillOut]


class PathOut(BaseModel):
    course_id: int
    language: str
    title: str
    units: list[UnitOut]


# ----- lessons -----
class ExerciseOut(BaseModel):
    """Note: there is deliberately NO correct_answer field here."""
    model_config = ConfigDict(from_attributes=True)   # allow building it from a DB row
    id: int
    type: str
    prompt: str
    data: dict
    order_index: int


class LessonOut(BaseModel):
    id: int
    skill_id: int
    skill_title: str
    xp_reward: int
    exercises: list[ExerciseOut]


class AnswerIn(BaseModel):
    exercise_id: int
    # string (multiple choice / fill blank / type), list of words (translate),
    # or {english: spanish} (match pairs)
    answer: Union[str, list[str], dict[str, str]]


class AnswerOut(BaseModel):
    correct: bool
    correct_answer: str
    hearts: int
    out_of_hearts: bool


class CompleteIn(BaseModel):
    mistakes: int = Field(default=0, ge=0)


class AchievementOut(BaseModel):
    code: str
    name: str
    description: str
    icon: str
    earned: bool = False
    earned_at: datetime | None = None


class CompleteOut(BaseModel):
    xp_earned: int
    total_xp: int
    streak: int
    today_xp: int
    daily_goal_xp: int
    daily_goal_just_met: bool
    skill_completed: bool
    crowns: int
    total_lessons: int
    new_achievements: list[AchievementOut]


# ----- leaderboard / debug -----
class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    name: str
    weekly_xp: int
    is_me: bool


class DebugDayOut(BaseModel):
    day_offset: int
    simulated_date: date