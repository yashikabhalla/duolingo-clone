from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Achievement, User, UserAchievement
from ..schemas import AchievementOut, UserOut
from ..services import clock, hearts, stats

router = APIRouter(prefix="/api", tags=["user"])


@router.get("/user", response_model=UserOut)
def get_user(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return stats.build_user_state(db, user, clock.sim_now(db))


@router.post("/hearts/refill", response_model=UserOut)
def refill_hearts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    now = clock.sim_now(db)
    try:
        hearts.refill(user, now)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    db.commit()
    return stats.build_user_state(db, user, now)


@router.get("/achievements", response_model=list[AchievementOut])
def get_achievements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    earned = {ua.achievement_id: ua.earned_at for ua in
              db.query(UserAchievement).filter_by(user_id=user.id)}
    return [AchievementOut(code=a.code, name=a.name, description=a.description, icon=a.icon,
                           earned=a.id in earned, earned_at=earned.get(a.id))
            for a in db.query(Achievement).order_by(Achievement.id)]