"""Hearts: lose one on a wrong answer, regain over time or by (mock) refill.

Regeneration is LAZY: no background job. We store `hearts` and `hearts_updated_at`,
and whenever the user is loaded we work out how many hearts were earned in the meantime.
"""
from datetime import datetime, timedelta

from ..models import User

MAX_HEARTS = 5
REGEN_INTERVAL = timedelta(minutes=30)   # 1 heart per 30 min (short so it is easy to demo)
REFILL_COST_GEMS = 350


def refresh_hearts(user: User, now: datetime) -> None:
    if user.hearts >= MAX_HEARTS:
        user.hearts = MAX_HEARTS
        user.hearts_updated_at = now          # full hearts -> no timer running
        return
    regained = (now - user.hearts_updated_at) // REGEN_INTERVAL   # whole intervals passed
    if regained <= 0:
        return
    user.hearts = min(MAX_HEARTS, user.hearts + regained)
    if user.hearts == MAX_HEARTS:
        user.hearts_updated_at = now
    else:
        # move the timer forward by exactly the intervals we paid out (keeps leftover time)
        user.hearts_updated_at += regained * REGEN_INTERVAL


def seconds_until_next_heart(user: User, now: datetime) -> int | None:
    if user.hearts >= MAX_HEARTS:
        return None
    remaining = REGEN_INTERVAL - (now - user.hearts_updated_at)
    return max(0, int(remaining.total_seconds()))


def lose_heart(user: User, now: datetime) -> None:
    refresh_hearts(user, now)
    if user.hearts <= 0:
        return
    if user.hearts == MAX_HEARTS:
        user.hearts_updated_at = now          # losing from full starts the regen timer
    user.hearts -= 1


def refill(user: User, now: datetime) -> None:
    """Mocked purchase: spend gems to get back to full hearts."""
    refresh_hearts(user, now)
    if user.hearts >= MAX_HEARTS:
        raise ValueError("Your hearts are already full")
    if user.gems < REFILL_COST_GEMS:
        raise ValueError("Not enough gems")
    user.gems -= REFILL_COST_GEMS
    user.hearts = MAX_HEARTS
    user.hearts_updated_at = now