from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Exercise, Lesson, User
from ..schemas import AnswerIn, AnswerOut, CompleteIn, CompleteOut, ExerciseOut, LessonOut
from ..services import answers, clock, hearts, path, rewards

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


def _playable_lesson(db: Session, user: User, lesson_id: int) -> Lesson:
    """Shared guard: the lesson exists, its skill is unlocked, and the user has hearts.
    The detail strings are machine-readable so the frontend can pick the right modal."""
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="lesson_not_found")
    if not path.is_lesson_unlocked(db, user.id, lesson):
        raise HTTPException(status_code=403, detail="skill_locked")
    if user.hearts <= 0:
        raise HTTPException(status_code=403, detail="out_of_hearts")
    return lesson


@router.get("/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, user: User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    lesson = _playable_lesson(db, user, lesson_id)
    # ExerciseOut has no correct_answer field, so it is stripped from the response.
    return LessonOut(id=lesson.id, skill_id=lesson.skill_id, skill_title=lesson.skill.title,
                     xp_reward=lesson.xp_reward,
                     exercises=[ExerciseOut.model_validate(e) for e in lesson.exercises])


@router.post("/{lesson_id}/answer", response_model=AnswerOut)
def submit_answer(lesson_id: int, body: AnswerIn, user: User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    lesson = _playable_lesson(db, user, lesson_id)
    exercise = db.get(Exercise, body.exercise_id)
    if exercise is None or exercise.lesson_id != lesson.id:
        raise HTTPException(status_code=400, detail="exercise_not_in_lesson")

    correct, shown = answers.check_answer(exercise, body.answer)
    if not correct:
        hearts.lose_heart(user, clock.sim_now(db))
    db.commit()
    return AnswerOut(correct=correct, correct_answer=shown, hearts=user.hearts,
                     out_of_hearts=(not correct and user.hearts == 0))


@router.post("/{lesson_id}/complete", response_model=CompleteOut)
def complete_lesson(lesson_id: int, body: CompleteIn, user: User = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    lesson = _playable_lesson(db, user, lesson_id)
    result = rewards.complete_lesson(db, user, lesson, body.mistakes, clock.sim_today(db))
    db.commit()
    return result