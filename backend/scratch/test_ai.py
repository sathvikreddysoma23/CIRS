
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ai.classifier import classify_complaint

def test_classifier():
    test_cases = [
        ("fan not working", "from past two days throughout the day"),
        ("bus delayed", "the morning bus is late every day"),
        ("no water in hostel", "there is no water in building A hostel"),
        ("", ""), # Empty strings
        ("a" * 1000, "b" * 1000) # Long strings
    ]
    
    for title, desc in test_cases:
        try:
            print(f"Testing: '{title}' / '{desc}'")
            res = classify_complaint(title, desc)
            print(f"Result: {res}")
        except Exception as e:
            print(f"FAILED for '{title}': {e}")

if __name__ == "__main__":
    test_classifier()
