"""Server-side answer checking. The client never sees `correct_answer`."""
import re

from ..models import Exercise


def _norm(text: str) -> str:
    text = text.strip().casefold()
    text = re.sub(r"[.,!?¿¡]", "", text)
    return " ".join(text.split())


def check_answer(exercise: Exercise, answer) -> tuple[bool, str]:
    """Returns (is_correct, text_to_show_in_feedback_bar)."""
    correct = exercise.correct_answer
    kind = exercise.type

    if kind in ("multiple_choice", "fill_blank"):
        return (isinstance(answer, str) and answer == correct["value"], correct["value"])

    if kind == "translate":
        words = correct["words"]
        return (isinstance(answer, list) and answer == words, " ".join(words))

    if kind == "match_pairs":
        return (isinstance(answer, dict) and answer == correct["pairs"], "")

    if kind == "type_answer":
        accepted = correct["accepted"]
        ok = isinstance(answer, str) and _norm(answer) in {_norm(a) for a in accepted}
        return (ok, accepted[0])

    raise ValueError(f"Unknown exercise type: {kind}")