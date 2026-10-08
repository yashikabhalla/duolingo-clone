from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import PathOut
from ..services import path

router = APIRouter(prefix="/api/course", tags=["course"])


@router.get("/path", response_model=PathOut)
def get_path(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return path.compute_path(db, user.id)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))