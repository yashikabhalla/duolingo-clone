from datetime import datetime, date
from sqlalchemy import (
    String, Integer, ForeignKey, JSON, DateTime, Date, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


# ---------- CONTENT TABLES (same for every learner) ----------

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    language: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(100))

    units: Mapped[list["Unit"]] = relationship(
        back_populates="course", order_by="Unit.order_index"
    )


class Unit(Base):
    __tablename__ = "units"
    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(200), default="")
    order_index: Mapped[int] = mapped_column(Integer)

    course: Mapped["Course"] = relationship(back_populates="units")
    skills: Mapped[list["Skill"]] = relationship(
        back_populates="unit", order_by="Skill.order_index"
    )


class Skill(Base):
    __tablename__ = "skills"
    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    icon: Mapped[str] = mapped_column(String(10), default="⭐")
    order_index: Mapped[int] = mapped_column(Integer)

    unit: Mapped["Unit"] = relationship(back_populates="skills")
    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="skill", order_by="Lesson.order_index"
    )


class Lesson(Base):
    __tablename__ = "lessons"
    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    order_index: Mapped[int] = mapped_column(Integer)
    xp_reward: Mapped[int] = mapped_column(Integer, default=10)

    skill: Mapped["Skill"] = relationship(back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship(
        back_populates="lesson", order_by="Exercise.order_index"
    )


class Exercise(Base):
    __tablename__ = "exercises"
    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"), index=True)
    # one of: multiple_choice, translate, match_pairs, fill_blank, type_answer
    type: Mapped[str] = mapped_column(String(30))
    prompt: Mapped[str] = mapped_column(String(300))
    # type-specific stuff: options, word bank, pairs, sentence with a blank...
    data: Mapped[dict] = mapped_column(JSON, default=dict)
    # what counts as correct (shape depends on type)
    correct_answer: Mapped[dict] = mapped_column(JSON)
    order_index: Mapped[int] = mapped_column(Integer)

    lesson: Mapped["Lesson"] = relationship(back_populates="exercises")


# ---------- USER + PROGRESS TABLES (per learner) ----------

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    streak_count: Mapped[int] = mapped_column(Integer, default=0)
    last_active_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    hearts: Mapped[int] = mapped_column(Integer, default=5)
    hearts_updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    gems: Mapped[int] = mapped_column(Integer, default=500)  # mocked
    daily_goal_xp: Mapped[int] = mapped_column(Integer, default=20)


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"), index=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)


class DailyXP(Base):
    __tablename__ = "daily_xp"
    __table_args__ = (UniqueConstraint("user_id", "date"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    date: Mapped[date] = mapped_column(Date)
    xp: Mapped[int] = mapped_column(Integer, default=0)


class Achievement(Base):
    __tablename__ = "achievements"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(200))
    icon: Mapped[str] = mapped_column(String(10), default="🏆")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id"))
    earned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)