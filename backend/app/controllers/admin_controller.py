from fastapi import HTTPException
from app.database import get_db
from bson import ObjectId
from datetime import datetime


def _s(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


async def list_users(role: str = None, page: int = 1, limit: int = 20) -> dict:
    db = get_db()
    query = {}
    if role:
        query["role"] = role
    skip = (page - 1) * limit
    total = await db["users"].count_documents(query)
    cursor = db["users"].find(query, {"hashed_password": 0}).skip(skip).limit(limit)
    users = [_s(doc) async for doc in cursor]
    return {"users": users, "total": total, "page": page, "pages": (total + limit - 1) // limit}


async def toggle_user_active(user_id: str, is_active: bool) -> dict:
    db = get_db()
    result = await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": is_active, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    user = await db["users"].find_one({"_id": ObjectId(user_id)}, {"hashed_password": 0})
    return _s(user)


async def delete_user(user_id: str) -> dict:
    db = get_db()
    result = await db["users"].delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "User deleted successfully."}


async def get_dashboard_overview() -> dict:
    db = get_db()
    total_users = await db["users"].count_documents({})
    students = await db["users"].count_documents({"role": "student"})
    departments = await db["users"].count_documents({"role": "department"})

    total_complaints = await db["complaints"].count_documents({})
    pending = await db["complaints"].count_documents({"status": "pending"})
    in_progress = await db["complaints"].count_documents({"status": "in_progress"})
    resolved = await db["complaints"].count_documents({"status": "resolved"})

    low_stock_medicines = await db["medicines"].count_documents({"is_low_stock": True})
    buses_operational = await db["buses"].count_documents({"status": "operational"})
    buses_maintenance = await db["buses"].count_documents({"status": "under_maintenance"})
    doctors_available = await db["doctors"].count_documents({"availability": "available"})

    return {
        "users": {"total": total_users, "students": students, "departments": departments},
        "complaints": {
            "total": total_complaints,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
        },
        "operations": {
            "low_stock_medicines": low_stock_medicines,
            "buses_operational": buses_operational,
            "buses_under_maintenance": buses_maintenance,
            "doctors_available": doctors_available,
        },
    }
