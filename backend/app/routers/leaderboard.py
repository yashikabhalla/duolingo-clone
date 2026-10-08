from datetime import timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import and_, desc, func
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import DailyXP, User
from ..schemas import LeaderboardEntry
from ..services import clock

router = APIRouter(prefix="/api", tags=["leaderboard"])


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(me: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = clock.sim_today(db)
    since = today - timedelta(days=6)                      # last 7 days including today
    weekly_xp = func.coalesce(func.sum(DailyXP.xp), 0).label("weekly_xp")
    rows = (
        db.query(User.id, User.name, weekly_xp)
        .outerjoin(DailyXP, and_(DailyXP.user_id == User.id,
                                 DailyXP.date >= since, DailyXP.date <= today))
        .group_by(User.id)
        .order_by(desc("weekly_xp"), User.name)
        .all()
    )
    return [LeaderboardEntry(rank=i, user_id=r.id, name=r.name, weekly_xp=r.weekly_xp,
                             is_me=(r.id == me.id))
            for i, r in enumerate(rows, start=1)]