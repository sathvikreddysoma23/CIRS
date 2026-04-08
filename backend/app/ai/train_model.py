"""
Training script for the CIRS complaint classifier.

Usage (run once after collecting enough labeled data):
    python -m app.ai.train_model

The script trains a TF-IDF + Logistic Regression pipeline on labeled
complaints and saves the model for use by the live classifier.
"""

import os
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

TRAINING_DATA = [
    # (text, category)
    ("light not working classroom electricity broken fan", "infrastructure"),
    ("power cut in hostel wiring problem", "infrastructure"),
    ("bus late driver route transport delay shuttle", "transportation"),
    ("bus not arrived pick drop schedule", "transportation"),
    ("hostel room dirty bathroom problem dorm", "housing"),
    ("mess food bad accommodation bed warden", "housing"),
    ("garbage bin overflow dirty smell toilet washroom", "sanitation"),
    ("cockroach pest hygiene waste cleaning", "sanitation"),
    ("library book not available reference study room", "library"),
    ("librarian fine internet computer catalog", "library"),
    ("doctor not available medicine clinic sick fever", "healthcare"),
    ("nurse health emergency pharmacy drug injury", "healthcare"),
    ("broken wall paint repair building maintenance", "infrastructure"),
    ("vehicle driver pick campus ambulance emergency", "transportation"),
    ("hostel bathroom shower no water dorm room", "housing"),
    ("sewage drain smell odor sanitation washroom", "sanitation"),
    ("book journal borrow return fine library", "library"),
    ("first aid pain sick health clinic medicine", "healthcare"),
]


def train_and_save():
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression
        from sklearn.pipeline import Pipeline
        import joblib

        texts = [row[0] for row in TRAINING_DATA]
        labels = [row[1] for row in TRAINING_DATA]

        vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
        X = vectorizer.fit_transform(texts)

        model = LogisticRegression(max_iter=500, multi_class="multinomial", solver="lbfgs")
        model.fit(X, labels)

        save_dir = Path(__file__).parent
        joblib.dump(model, save_dir / "saved_model.joblib")
        joblib.dump(vectorizer, save_dir / "saved_vectorizer.joblib")

        print("✅ Model trained and saved successfully.")
        print(f"   Categories: {model.classes_.tolist()}")
        print(f"   Training samples: {len(texts)}")

    except ImportError as e:
        print(f"❌ Missing dependency: {e}. Run: pip install scikit-learn joblib")
    except Exception as e:
        print(f"❌ Training failed: {e}")


if __name__ == "__main__":
    train_and_save()
