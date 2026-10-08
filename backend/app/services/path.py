"""Builds the learning path and decides what is locked / available / completed.

Nothing here is stored: status is DERIVED from user_lesson_progress every time.
Rule: a skill is unlocked when the previous skill (across units, in order) is completed.
"""
from sqlalchemy.orm import Session, selectinload

from ..models import Course, Lesson, Skill, Unit, UserLessonProgress


def compute_path(db: Session, user_id: int) -> dict:
    course = (
        db.query(Course)
        .options(selectinload(Course.units).selectinload(Unit.skills).selectinload(Skill.lessons))
        .order_by(Course.id)
        .first()
    )
    if course is None:
        raise LookupError("No course found - did you run seed.py?")

    done = {r.lesson_id for r in db.query(UserLessonProgress.lesson_id).filter(
        UserLessonProgress.user_id == user_id)}

    units_out = []
    previous_completed = True            # the very first skill is always unlocked
    for unit in course.units:
        skills_out = []
        for skill in unit.skills:
            lesson_ids = [l.id for l in skill.lessons]
            crowns = sum(1 for i in lesson_ids if i in done)
            total = len(lesson_ids)
            completed = total > 0 and crowns == total

            if completed:
                status = "completed"
            elif previous_completed:
                status = "available"
            else:
                status = "locked"

            if status == "locked":
                next_lesson_id = None
            else:   # first unfinished lesson; for a completed skill, replay from lesson 1
                next_lesson_id = next((i for i in lesson_ids if i not in done),
                                      lesson_ids[0] if lesson_ids else None)

            skills_out.append({
                "id": skill.id, "title": skill.title, "icon": skill.icon,
                "order_index": skill.order_index, "status": status,
                "crowns": crowns, "total_lessons": total, "next_lesson_id": next_lesson_id,
            })
            previous_completed = completed
        units_out.append({
            "id": unit.id, "title": unit.title, "description": unit.description,
            "order_index": unit.order_index, "skills": skills_out,
        })
    return {"course_id": course.id, "language": course.language,
            "title": course.title, "units": units_out}


def is_lesson_unlocked(db: Session, user_id: int, lesson: Lesson) -> bool:
    path = compute_path(db, user_id)
    for unit in path["units"]:
        for skill in unit["skills"]:
            if skill["id"] == lesson.skill_id:
                return skill["status"] != "locked"
    return False