"""Fills the database with one Spanish course, a demo learner and leaderboard rivals.

Run from the backend/ folder:   python seed.py
WARNING: it wipes all tables first, so it always starts from a clean state.
"""
import random
from datetime import date, datetime, timedelta

from app import models as m
from app.database import Base, SessionLocal, engine
from app.services.clock import real_today

# ---------- tiny builders: one per exercise type ----------
# Each returns a dict that matches the columns of the `exercises` table.

def multiple_choice(prompt, options, answer):
    return {
        "type": "multiple_choice",
        "prompt": prompt,
        "data": {"options": options},
        "correct_answer": {"value": answer},
    }


def translate(sentence, word_bank, words):
    """Word-bank exercise: the learner taps chips to build the Spanish sentence."""
    return {
        "type": "translate",
        "prompt": "Write this in Spanish",
        "data": {"sentence": sentence, "word_bank": word_bank},
        "correct_answer": {"words": words},  # the correct chips, in order
    }


def match_pairs(pairs):
    """pairs = [(english, spanish), ...]"""
    return {
        "type": "match_pairs",
        "prompt": "Tap the matching pairs",
        "data": {"pairs": [{"left": en, "right": es} for en, es in pairs]},
        "correct_answer": {"pairs": {en: es for en, es in pairs}},
    }


def fill_blank(before, after, options, answer):
    return {
        "type": "fill_blank",
        "prompt": "Fill in the missing word",
        "data": {"before": before, "after": after, "options": options},
        "correct_answer": {"value": answer},
    }


def type_answer(prompt, accepted):
    """`accepted` lists every spelling we allow (e.g. with and without accent)."""
    return {
        "type": "type_answer",
        "prompt": prompt,
        "data": {},
        "correct_answer": {"accepted": accepted},
    }


# ---------- the course content ----------
# Structure: units -> skills -> lessons (each lesson is a list of exercises)

COURSE = {
    "language": "Spanish",
    "title": "Spanish for English speakers",
    "units": [
        {
            "title": "Say Hello",
            "description": "Greet people and be polite",
            "skills": [
                {
                    "title": "Greetings",
                    "icon": "👋",
                    "lessons": [
                        [
                            multiple_choice("Which one means “hello”?", ["hola", "adiós", "gracias", "por favor"], "hola"),
                            multiple_choice("Which one means “thank you”?", ["por favor", "gracias", "hola", "adiós"], "gracias"),
                            match_pairs([("hello", "hola"), ("goodbye", "adiós"), ("thank you", "gracias"), ("please", "por favor")]),
                            type_answer("Type “goodbye” in Spanish", ["adiós", "adios"]),
                            translate("Hello, thank you", ["Hola", "gracias", "adiós", "por favor", "y"], ["Hola", "gracias"]),
                        ],
                        [
                            multiple_choice("How do you say “good morning”?", ["buenas noches", "buenos días", "buenas tardes", "hasta luego"], "buenos días"),
                            fill_blank("", ", me llamo Ana.", ["Hola", "Gracias", "Adiós"], "Hola"),
                            translate("My name is Ana", ["Me", "llamo", "Ana", "eres", "tú"], ["Me", "llamo", "Ana"]),
                            type_answer("Type “good night” in Spanish", ["buenas noches"]),
                            match_pairs([("good morning", "buenos días"), ("good night", "buenas noches"), ("good afternoon", "buenas tardes"), ("see you later", "hasta luego")]),
                        ],
                    ],
                },
                {
                    "title": "Café Basics",
                    "icon": "☕",
                    "lessons": [
                        [
                            multiple_choice("Which one means “coffee”?", ["la leche", "el pan", "el café", "el agua"], "el café"),
                            multiple_choice("Which one means “water”?", ["el agua", "el pan", "el té", "el café"], "el agua"),
                            match_pairs([("coffee", "el café"), ("water", "el agua"), ("milk", "la leche"), ("bread", "el pan")]),
                            fill_blank("Yo bebo ", ".", ["agua", "pan", "silla"], "agua"),
                            translate("I drink coffee", ["Yo", "bebo", "café", "como", "pan", "agua"], ["Yo", "bebo", "café"]),
                        ],
                        [
                            multiple_choice("Which one means “tea”?", ["el té", "el jugo", "la sopa", "la leche"], "el té"),
                            type_answer("Type “milk” in Spanish", ["la leche", "leche"]),
                            translate("I eat bread", ["Yo", "como", "pan", "bebo", "leche"], ["Yo", "como", "pan"]),
                            fill_blank("Yo como ", ".", ["pan", "café", "agua"], "pan"),
                            match_pairs([("tea", "el té"), ("juice", "el jugo"), ("soup", "la sopa"), ("sandwich", "el sándwich")]),
                        ],
                    ],
                },
            ],
        },
        {
            "title": "At the Table",
            "description": "Order food and count",
            "skills": [
                {
                    "title": "Ordering",
                    "icon": "🍽️",
                    "lessons": [
                        [
                            multiple_choice("Which one means “I want”?", ["tengo", "quiero", "voy", "soy"], "quiero"),
                            translate("I want water", ["Quiero", "agua", "café", "bebo", "un"], ["Quiero", "agua"]),
                            fill_blank("", " un café, por favor.", ["Quiero", "Gracias", "Hola"], "Quiero"),
                            type_answer("Type “the bill” in Spanish", ["la cuenta", "cuenta"]),
                            match_pairs([("the menu", "el menú"), ("the bill", "la cuenta"), ("the table", "la mesa"), ("the waiter", "el camarero")]),
                        ],
                        [
                            multiple_choice("Which one means “How much is it?”", ["¿Dónde está?", "¿Cómo estás?", "¿Cuánto cuesta?", "¿Qué hora es?"], "¿Cuánto cuesta?"),
                            translate("A coffee, please", ["Un", "café", "por favor", "gracias", "agua"], ["Un", "café", "por favor"]),
                            fill_blank("Quiero ", " café.", ["un", "una", "el"], "un"),
                            type_answer("Type “please” in Spanish", ["por favor"]),
                            match_pairs([("yes", "sí"), ("no", "no"), ("with", "con"), ("without", "sin")]),
                        ],
                    ],
                },
                {
                    "title": "Numbers",
                    "icon": "🔢",
                    "lessons": [
                        [
                            multiple_choice("Which one means “one”?", ["dos", "uno", "tres", "cuatro"], "uno"),
                            match_pairs([("one", "uno"), ("two", "dos"), ("three", "tres"), ("four", "cuatro")]),
                            type_answer("Type “two” in Spanish", ["dos"]),
                            translate("I want two coffees", ["Quiero", "dos", "cafés", "tres", "agua"], ["Quiero", "dos", "cafés"]),
                            fill_blank("Quiero ", " cafés.", ["dos", "una", "el"], "dos"),
                        ],
                        [
                            multiple_choice("Which one means “five”?", ["seis", "siete", "cinco", "ocho"], "cinco"),
                            match_pairs([("five", "cinco"), ("six", "seis"), ("seven", "siete"), ("eight", "ocho")]),
                            type_answer("Type “ten” in Spanish", ["diez"]),
                            translate("I have three breads", ["Tengo", "tres", "panes", "dos", "café"], ["Tengo", "tres", "panes"]),
                            fill_blank("Quiero ", " aguas.", ["cuatro", "el", "la"], "cuatro"),
                        ],
                    ],
                },
            ],
        },
    ],
}

ACHIEVEMENTS = [
    ("first_lesson", "First Steps", "Complete your first lesson", "🎯"),
    ("streak_3", "On Fire", "Reach a 3-day streak", "🔥"),
    ("xp_100", "Century", "Earn 100 XP", "💯"),
    ("perfect_lesson", "Flawless", "Finish a lesson without losing a heart", "✨"),
]

RIVAL_NAMES = ["Aarav", "Meera", "Kabir", "Sana", "Rohan", "Ishita", "Vikram", "Anaya", "Dev", "Tara"]


# ---------- seeding steps ----------

def seed_course(db):
    """Insert the course tree. Returns the lessons in learning order."""
    course = m.Course(language=COURSE["language"], title=COURSE["title"])
    db.add(course)
    db.flush()  # flush = send INSERT now so `course.id` gets filled in

    all_lessons = []
    for u_idx, unit_data in enumerate(COURSE["units"], start=1):
        unit = m.Unit(course_id=course.id, title=unit_data["title"],
                      description=unit_data["description"], order_index=u_idx)
        db.add(unit)
        db.flush()
        for s_idx, skill_data in enumerate(unit_data["skills"], start=1):
            skill = m.Skill(unit_id=unit.id, title=skill_data["title"],
                            icon=skill_data["icon"], order_index=s_idx)
            db.add(skill)
            db.flush()
            for l_idx, exercises in enumerate(skill_data["lessons"], start=1):
                lesson = m.Lesson(skill_id=skill.id, order_index=l_idx, xp_reward=10)
                db.add(lesson)
                db.flush()
                all_lessons.append(lesson)
                for e_idx, ex in enumerate(exercises, start=1):
                    db.add(m.Exercise(lesson_id=lesson.id, order_index=e_idx, **ex))
    return all_lessons


def seed_achievements(db):
    rows = [m.Achievement(code=c, name=n, description=d, icon=i) for c, n, d, i in ACHIEVEMENTS]
    db.add_all(rows)
    db.flush()
    return {a.code: a for a in rows}


def seed_demo_user(db, first_lesson, achievements):
    """The default logged-in learner: finished one lesson today, so the app isn't empty."""
    today = real_today()
    user = m.User(name="Demo Learner", total_xp=10, streak_count=1,
                  last_active_date=today, hearts=5, gems=500, daily_goal_xp=20)
    db.add(user)
    db.flush()
    db.add(m.UserLessonProgress(user_id=user.id, lesson_id=first_lesson.id, xp_earned=10))
    db.add(m.DailyXP(user_id=user.id, date=today, xp=10))
    db.add(m.UserAchievement(user_id=user.id, achievement_id=achievements["first_lesson"].id))
    return user


def seed_rivals(db):
    """Fake users with XP over the last 7 days, so the leaderboard has real data."""
    random.seed(42)  # same "random" numbers every run -> reproducible demo
    today = real_today()
    for name in RIVAL_NAMES:
        days_active = random.sample(range(7), k=random.randint(3, 7))
        week_xp = 0
        user = m.User(name=name, streak_count=random.randint(0, 10), last_active_date=today)
        db.add(user)
        db.flush()
        for days_ago in days_active:
            xp = random.choice([10, 20, 30, 40, 50])
            week_xp += xp
            db.add(m.DailyXP(user_id=user.id, date=today - timedelta(days=days_ago), xp=xp))
        user.total_xp = week_xp + random.randint(0, 300)


def run_seed(db):
    lessons = seed_course(db)
    achievements = seed_achievements(db)
    seed_demo_user(db, lessons[0], achievements)
    seed_rivals(db)
    db.commit()


def seed_if_empty():
    """Handy for deployment: only seeds when the database has no course yet."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(m.Course).first() is None:
            run_seed(db)


if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)    # wipe old tables
    Base.metadata.create_all(bind=engine)  # recreate from models.py
    with SessionLocal() as db:
        run_seed(db)
    print("Seeded OK")