from app.database import get_db
from app.models.notification import NotificationInDB, NotificationType
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

def _serialize(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def create_notification(user_id: str, title: str, message: str, type: str, link: Optional[str] = None):
    db = get_db()
    new_notif = {
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": type,
        "link": link,
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    result = await db["notifications"].insert_one(new_notif)
    return str(result.inserted_id)

async def get_user_notifications(user_id: str, only_unread: bool = True) -> List[dict]:
    db = get_db()
    query = {"user_id": user_id}
    if only_unread:
        query["is_read"] = False
    
    cursor = db["notifications"].find(query).sort("created_at", -1)
    return [_serialize(doc) async for doc in cursor]

async def mark_as_read(notification_id: str, user_id: str):
    db = get_db()
    await db["notifications"].update_one(
        {"_id": ObjectId(notification_id), "user_id": user_id},
        {"$set": {"is_read": True}}
    )

async def mark_all_as_read(user_id: str):
    db = get_db()
    await db["notifications"].update_many(
        {"user_id": user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )

async def delete_notification(notification_id: str, user_id: str):
    db = get_db()
    await db["notifications"].delete_one({"_id": ObjectId(notification_id), "user_id": user_id})
