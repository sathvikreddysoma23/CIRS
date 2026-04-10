from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class NotificationType(str, Enum):
    status_change = "status_change"
    assignment = "assignment"
    comment = "comment"
    system = "system"


class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    type: NotificationType = NotificationType.system
    link: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationInDB(NotificationBase):
    id: Optional[str] = Field(default=None, alias="_id")

    class Config:
        populate_by_name = True
