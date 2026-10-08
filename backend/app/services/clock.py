"""One place that answers "what time/day is it?".

Everything in the app asks this module instead of calling datetime.now() directly.
That lets us fake "tomorrow" (POST /api/debug/advance-day) so streaks can be tested
without waiting 24 hours. The offset is stored in the DB so it survives restarts.
All times are naive UTC.
"""
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from ..models import AppSetting

OFFSET_KEY = "day_offset"


def real_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def real_today() -> date:
    return real_now().date()


def get_offset(db: Session) -> int:
    row = db.get(AppSetting, OFFSET_KEY)
    return int(row.value) if row else 0


def sim_now(db: Session) -> datetime:
    return real_now() + timedelta(days=get_offset(db))


def sim_today(db: Session) -> date:
    return sim_now(db).date()


def advance_day(db: Session) -> int:
    row = db.get(AppSetting, OFFSET_KEY)
    if row is None:
        row = AppSetting(key=OFFSET_KEY, value="0")
        db.add(row)
    row.value = str(int(row.value) + 1)
    db.commit()
    return int(row.value)