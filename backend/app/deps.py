"""Shared FastAPI dependencies."""
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import User
from .services import clock, hearts

DEFAULT_USER_ID = 1   # auth is simplified: everyone is the seeded "Demo Learner"


def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.get(User, DEFAULT_USER_ID)
    if user is None:
        raise HTTPException(status_code=404, detail="Default user not found - run seed.py")
    # Lazy heart regeneration: bring hearts up to date on every request.
    hearts.refresh_hearts(user, clock.sim_now(db))
    db.commit()
    return user