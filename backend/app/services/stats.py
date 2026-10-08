"""Read-only helpers that assemble numbers about a user."""
from datetime import date, datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models import DailyXP, User, UserLessonProgress
from . import hearts, streak


def xp_today(db: Session, user_id: int, today: date) -> int:
    return db.query(DailyXP.xp).filter(
        DailyXP.user_id == user_id, DailyXP.date == today).scalar() or 0


def lessons_completed(db: Session, user_id: int) -> int:
    return db.query(func.count(UserLessonProgress.id)).filter(
        UserLessonProgress.user_id == user_id).scalar() or 0


def build_user_state(db: Session, user: User, now: datetime) -> dict:
    today = now.date()
    today_xp = xp_today(db, user.id, today)
    return {
        "id": user.id, "name": user.name, "total_xp": user.total_xp,
        "streak": streak.current_streak(user, today),
        "streak_active_today": user.last_active_date == today,
        "hearts": user.hearts, "max_hearts": hearts.MAX_HEARTS,
        "seconds_until_next_heart": hearts.seconds_until_next_heart(user, now),
        "gems": user.gems, "daily_goal_xp": user.daily_goal_xp,
        "today_xp": today_xp, "daily_goal_met": today_xp >= user.daily_goal_xp,
        "lessons_completed": lessons_completed(db, user.id),
    }