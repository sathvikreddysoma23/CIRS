from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ComplaintCategory(str, Enum):
    infrastructure = "infrastructure"
    transportation = "transportation"
    housing = "housing"
    sanitation = "sanitation"
    library = "library"
    healthcare = "healthcare"
    other = "other"


class ComplaintPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class ComplaintStatus(str, Enum):
    pending = "pending"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"
    rejected = "rejected"


class StatusUpdate(BaseModel):
    status: ComplaintStatus
    note: str
    updated_by: str           # user id
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ComplaintBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    location: Optional[str] = None
    category: ComplaintCategory = ComplaintCategory.other
    priority: ComplaintPriority = ComplaintPriority.medium

    class Config:
        use_enum_values = True


class ComplaintCreate(ComplaintBase):
    pass   # image_urls added after upload


class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[ComplaintCategory] = None
    priority: Optional[ComplaintPriority] = None


class ComplaintInDB(ComplaintBase):
    id: Optional[str] = Field(default=None, alias="_id")
    student_id: str
    student_name: str
    assigned_to: Optional[str] = None          # department user id
    assigned_department: Optional[str] = None
    status: ComplaintStatus = ComplaintStatus.pending
    image_urls: List[str] = []
    ai_category: Optional[str] = None          # NLP predicted category
    ai_priority: Optional[str] = None          # NLP predicted priority
    ai_confidence: Optional[float] = None
    status_history: List[StatusUpdate] = []
    resolution_note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True


class ComplaintResponse(ComplaintInDB):
    pass
