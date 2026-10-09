"""Turns a stored exercise into what the learner is ALLOWED to see.

Two jobs:
1. Shuffle options / word bank / match columns, so the right answer is not always in the
   same position (the seed lists them in a fixed order).
2. For match-pairs, send two separate columns instead of the pairs, so the pairing itself
   is not in the response.
"""
import random

from ..models import Exercise


def _shuffled(items: list) -> list:
    return random.sample(items, len(items))


def present_exercise_data(exercise: Exercise) -> dict:
    data = dict(exercise.data)
    if exercise.type in ("multiple_choice", "fill_blank"):
        data["options"] = _shuffled(data["options"])
    elif exercise.type == "translate":
        data["word_bank"] = _shuffled(data["word_bank"])
    elif exercise.type == "match_pairs":
        pairs = data["pairs"]
        data = {
            "left": [p["left"] for p in pairs],
            "right": _shuffled([p["right"] for p in pairs]),
        }
    return data