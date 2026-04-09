"""
CIRS AI Classifier – NLP-based complaint classification & priority detection.

Strategy:
  1. Try to load a pre-trained scikit-learn model (trained on real data).
  2. If no model found, fall back to a rule-based keyword classifier.

This keeps the system functional from day one even without training data,
and becomes smarter as you collect and label real complaints.
"""

import re
import logging
from typing import Optional
import os

logger = logging.getLogger(__name__)

# ─── Keyword Rules (fallback) ──────────────────────────────────────────────

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "infrastructure": [
        "light", "electricity", "power", "fan", "ac", "air condition", "leak", "roof",
        "window", "door", "wall", "paint", "building", "classroom", "lab", "wiring",
        "broken", "repair", "maintenance", "floor", "ceiling",
    ],
    "transportation": [
        "bus", "vehicle", "route", "driver", "transport", "pick", "drop", "shuttle",
        "arrival", "departure", "late", "delay", "schedule",
    ],
    "housing": [
        "hostel", "room", "dormitory", "dorm", "warden", "bed", "mess", "accommodation",
        "stay", "housing", "residential", "bathroom", "toilet", "shower",
    ],
    "sanitation": [
        "garbage", "waste", "cleaning", "dirty", "smell", "odor", "hygiene", "dustbin",
        "toilet", "washroom", "drain", "sewage", "pest", "cockroach", "rat", "mosquito",
    ],
    "library": [
        "library", "book", "journal", "reference", "study room", "silence", "librarian",
        "return", "borrow", "fine", "catalog", "computer", "internet",
    ],
    "healthcare": [
        "doctor", "nurse", "clinic", "medicine", "sick", "health", "fever", "pain",
        "hospital", "ambulance", "first aid", "injury", "emergency", "pharmacy", "drug",
    ],
    "other": [],
}

PRIORITY_KEYWORDS: dict[str, list[str]] = {
    "critical": [
        "emergency", "fire", "flood", "accident", "danger", "urgent", "immediately",
        "critical", "severe", "life", "threat", "collapse",
    ],
    "high": [
        "no water", "no electricity", "broken", "not working", "serious", "important",
        "required", "asap", "blocking", "stuck",
    ],
    "low": [
        "minor", "small", "slight", "suggest", "request", "improve", "enhance", "wish",
        "optional", "feedback",
    ],
}


def _preprocess(text: str) -> str:
    return re.sub(r"[^a-z0-9\s]", " ", text.lower())


def rule_based_classify(title: str, description: str) -> dict:
    """Keyword-matching fallback classifier."""
    combined = _preprocess(f"{title} {description}")

    # Category
    category_scores: dict[str, int] = {cat: 0 for cat in CATEGORY_KEYWORDS}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in combined:
                category_scores[cat] += 1

    best_category = max(category_scores, key=category_scores.get)
    if category_scores[best_category] == 0:
        best_category = "other"

    # Priority
    priority = "medium"  # default
    for level in ["critical", "high", "low"]:
        for kw in PRIORITY_KEYWORDS.get(level, []):
            if kw in combined:
                priority = level
                break
        if priority != "medium":
            break

    # Rough confidence
    max_score = category_scores.get(best_category, 0)
    confidence = round(min(max_score / 3, 1.0), 2)  # cap at 1.0

    if best_category == "other":
        confidence = 0.0

    return {
        "category": best_category,
        "priority": priority,
        "confidence": confidence,
        "method": "rule_based",
    }


# ─── ML Model (Optional) ──────────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_model.joblib")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "saved_vectorizer.joblib")

_model = None
_vectorizer = None


def _try_load_model():
    global _model, _vectorizer
    try:
        import joblib
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            _model = joblib.load(MODEL_PATH)
            _vectorizer = joblib.load(VECTORIZER_PATH)
            logger.info("✅ ML classifier model loaded.")
        else:
            logger.info("ℹ️ No pre-trained model found. Using rule-based fallback.")
    except (ImportError, Exception) as e:
        logger.info(f"ℹ️ ML libraries (scikit-learn/joblib) not found or model load failed. Using rule-based fallback.")


_try_load_model()


def ml_classify(title: str, description: str) -> Optional[dict]:
    """Use scikit-learn model if available and libraries are installed."""
    if _model is None or _vectorizer is None:
        return None
    try:
        combined = _preprocess(f"{title} {description}")
        vec = _vectorizer.transform([combined])
        category = _model.predict(vec)[0]
        proba = _model.predict_proba(vec)[0]
        confidence = round(float(max(proba)), 2)
        return {
            "category": category,
            "priority": "medium",
            "confidence": confidence,
            "method": "ml_model",
        }
    except Exception as e:
        logger.error(f"ML classification error: {e}")
        return None


# ─── Public API ───────────────────────────────────────────────────────────

def classify_complaint(title: str, description: str) -> dict:
    """
    Main entry point. Returns:
    {
        "category": str,
        "priority": str,
        "confidence": float,
        "method": "ml_model" | "rule_based"
    }
    """
    result = ml_classify(title, description)
    if result:
        return result
    return rule_based_classify(title, description)
