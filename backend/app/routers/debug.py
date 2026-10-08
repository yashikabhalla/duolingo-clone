from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import DebugDayOut
from ..services import clock

router = APIRouter(prefix="/api/debug", tags=["debug"])


@router.post("/advance-day", response_model=DebugDayOut)
def advance_day(db: Session = Depends(get_db)):
    """Pretend one more day has passed (for testing streaks, hearts and the daily goal)."""
    offset = clock.advance_day(db)
    return DebugDayOut(day_offset=offset, simulated_date=clock.sim_today(db))


@router.get("/today", response_model=DebugDayOut)
def get_today(db: Session = Depends(get_db)):
    return DebugDayOut(day_offset=clock.get_offset(db), simulated_date=clock.sim_today(db))