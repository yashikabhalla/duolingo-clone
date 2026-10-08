"""Everything that happens when a lesson is completed: XP, daily XP, streak, progress, badges."""
from datetime import date

from sqlalchemy.orm import Session

from ..models import (Achievement, DailyXP, Lesson, Skill, User,
                      UserAchievement, UserLessonProgress)
from . import stats, streak


def _award_achievements(db: Session, user: User, mistakes: int) -> list[Achievement]:
    earned_codes = {code for (code,) in db.query(Achievement.code)
                    .join(UserAchievement, UserAchievement.achievement_id == Achievement.id)
                    .filter(UserAchievement.user_id == user.id)}
    candidates = set()
    if stats.lessons_completed(db, user.id) >= 1:
        candidates.add("first_lesson")
    if user.streak_count >= 3:
        candidates.add("streak_3")
    if user.total_xp >= 100:
        candidates.add("xp_100")
    if mistakes == 0:
        candidates.add("perfect_lesson")

    new_codes = candidates - earned_codes
    if not new_codes:
        return []
    new_rows = db.query(Achievement).filter(Achievement.code.in_(new_codes)).all()
    for a in new_rows:
        db.add(UserAchievement(user_id=user.id, achievement_id=a.id))
    return new_rows


def complete_lesson(db: Session, user: User, lesson: Lesson, mistakes: int, today: date) -> dict:
    xp = lesson.xp_reward
    xp_before = stats.xp_today(db, user.id, today)

    # 1) progress: one row per (user, lesson); replays still give XP but no second row
    first_time = db.query(UserLessonProgress).filter_by(
        user_id=user.id, lesson_id=lesson.id).first() is None
    if first_time:
        db.add(UserLessonProgress(user_id=user.id, lesson_id=lesson.id, xp_earned=xp))

    # 2) XP: lifetime total + today's bucket (used by the daily goal)
    user.total_xp += xp
    row = db.query(DailyXP).filter_by(user_id=user.id, date=today).first()
    if row is None:
        row = DailyXP(user_id=user.id, date=today, xp=0)
        db.add(row)
    row.xp += xp

    # 3) streak
    streak.register_activity(user, today)
    db.flush()

    # 4) skill progress after this lesson
    skill = db.get(Skill, lesson.skill_id)
    total_lessons = len(skill.lessons)
    lesson_ids = [l.id for l in skill.lessons]
    crowns = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user.id,
        UserLessonProgress.lesson_id.in_(lesson_ids)).count()

    # 5) badges
    new_badges = _award_achievements(db, user, mistakes)

    xp_after = xp_before + xp
    return {
        "xp_earned": xp, "total_xp": user.total_xp, "streak": user.streak_count,
        "today_xp": xp_after, "daily_goal_xp": user.daily_goal_xp,
        "daily_goal_just_met": xp_before < user.daily_goal_xp <= xp_after,
        "skill_completed": first_time and crowns == total_lessons,
        "crowns": crowns, "total_lessons": total_lessons,
        "new_achievements": [{"code": a.code, "name": a.name,
                              "description": a.description, "icon": a.icon}
                             for a in new_badges],
    }