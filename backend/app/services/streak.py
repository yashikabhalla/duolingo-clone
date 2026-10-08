"""Streak = number of consecutive days with at least one completed lesson."""
from datetime import date, timedelta

from ..models import User


def register_activity(user: User, today: date) -> None:
    """Call when a lesson is completed."""
    if user.last_active_date == today:
        return                                   # already counted today
    if user.last_active_date == today - timedelta(days=1):
        user.streak_count += 1                   # continued from yesterday
    else:
        user.streak_count = 1                    # first ever, or the streak was broken
    user.last_active_date = today


def current_streak(user: User, today: date) -> int:
    """What to DISPLAY. If a whole day was missed the streak is already lost,
    even though the stored number only resets at the next lesson."""
    if user.last_active_date is None:
        return 0
    if user.last_active_date >= today - timedelta(days=1):
        return user.streak_count
    return 0