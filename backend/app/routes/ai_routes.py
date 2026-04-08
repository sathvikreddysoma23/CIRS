from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.ai.classifier import classify_complaint
from app.middleware.auth import get_current_active_user

router = APIRouter(prefix="/ai", tags=["AI / NLP"])


class ClassifyRequest(BaseModel):
    title: str
    description: str


@router.post("/classify", summary="Classify a complaint using NLP")
async def classify(body: ClassifyRequest, _=Depends(get_current_active_user)):
    """
    Takes a complaint title and description and returns:
    - Predicted category (infrastructure, transportation, etc.)
    - Predicted priority (low / medium / high / critical)
    - Confidence score
    - Method used (ml_model or rule_based)
    """
    result = classify_complaint(body.title, body.description)
    return result
