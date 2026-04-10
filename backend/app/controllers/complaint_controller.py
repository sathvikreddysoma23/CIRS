from fastapi import HTTPException, status, UploadFile
from app.database import get_db
from app.models.complaint import ComplaintCreate, ComplaintUpdate, StatusUpdate, ComplaintStatus
from app.utils.file_upload import upload_image
from app.utils.email_sender import send_complaint_submitted_email, send_status_update_email, send_assignment_email
from app.ai.classifier import classify_complaint
from bson import ObjectId
from datetime import datetime
from typing import Optional, List


def _serialize(doc: dict) -> dict:
    """Convert MongoDB _id to string."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


async def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: dict,
    images: Optional[List[UploadFile]] = None,
) -> dict:
    db = get_db()

    # Upload images if provided
    image_urls = []
    if images:
        for img in images:
            url = await upload_image(img)
            image_urls.append(url)

    # AI classification
    ai_result = classify_complaint(complaint_data.title, complaint_data.description)
    ai_cat = ai_result.get("category")
    ai_conf = ai_result.get("confidence", 0)

    # Use AI category if confidence is decent, OR if the user kept the default 'infrastructure'
    # which is often because they forgot to change it.
    final_category = complaint_data.category
    if ai_conf >= 0.6 and (complaint_data.category == "infrastructure" or ai_cat != "other"):
         # If AI is confident enough, it takes precedence for better routing accuracy
         final_category = ai_cat

    new_complaint = {
        "title": complaint_data.title,
        "description": complaint_data.description,
        "location": complaint_data.location,
        "category": final_category,
        "priority": complaint_data.priority, # Manual priority still kept, AI priority is stored separately
        "student_id": current_user["sub"],
        "student_name": current_user["name"],
        "status": ComplaintStatus.pending,
        "image_urls": image_urls,
        "ai_category": ai_cat,
        "ai_priority": ai_result.get("priority"),
        "ai_confidence": ai_conf,
        "assigned_to": None,
        "assigned_department": None,
        "status_history": [],
        "resolution_note": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }


    result = await db["complaints"].insert_one(new_complaint)
    new_complaint["_id"] = str(result.inserted_id)

    # Send confirmation email (non-blocking, best-effort)
    try:
        user = await db["users"].find_one({"_id": ObjectId(current_user["sub"])})
        if user and user.get("email"):
            await send_complaint_submitted_email(
                user["email"], user["name"], complaint_data.title, str(result.inserted_id)
            )
    except Exception:
        pass

    return new_complaint


async def get_complaints(
    current_user: dict,
    status_filter: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    db = get_db()
    query = {}

    # Students see only their own complaints
    if current_user["role"] == "student":
        query["student_id"] = current_user["sub"]
    # Department users see only assigned complaints
    elif current_user["role"] == "department":
        query["assigned_to"] = current_user["sub"]

    if status_filter:
        query["status"] = status_filter
    if category:
        query["category"] = category
    if priority:
        query["priority"] = priority

    skip = (page - 1) * limit
    total = await db["complaints"].count_documents(query)
    cursor = db["complaints"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    complaints = [_serialize(doc) async for doc in cursor]

    return {
        "complaints": complaints,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


async def get_complaint_by_id(complaint_id: str, current_user: dict) -> dict:
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    # Access control
    if current_user["role"] == "student" and complaint["student_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Access denied.")

    return _serialize(complaint)


async def update_complaint(complaint_id: str, update_data: ComplaintUpdate, current_user: dict) -> dict:
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")
    if complaint["student_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Only the complaint owner can edit it.")
    if complaint["status"] != ComplaintStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending complaints can be edited.")

    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    await db["complaints"].update_one({"_id": ObjectId(complaint_id)}, {"$set": updates})
    return await get_complaint_by_id(complaint_id, current_user)


async def assign_complaint(complaint_id: str, department_user_id: str, current_user: dict) -> dict:
    """Admin assigns a complaint to a department user."""
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    dept_user = await db["users"].find_one({"_id": ObjectId(department_user_id), "role": "department"})
    if not dept_user:
        raise HTTPException(status_code=404, detail="Department user not found.")

    status_entry = {
        "status": ComplaintStatus.assigned,
        "note": f"Assigned to {dept_user['name']} ({dept_user.get('department', 'N/A')})",
        "updated_by": current_user["sub"],
        "updated_at": datetime.utcnow(),
    }

    await db["complaints"].update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {
                "assigned_to": department_user_id,
                "assigned_department": dept_user.get("department"),
                "status": ComplaintStatus.assigned,
                "updated_at": datetime.utcnow(),
            },
            "$push": {"status_history": status_entry},
        },
    )

    # Notify department
    try:
        await send_assignment_email(
            dept_user["email"], dept_user["name"], complaint["title"], complaint_id
        )
    except Exception:
        pass

    updated = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    return _serialize(updated)


async def update_complaint_status(
    complaint_id: str,
    new_status: str,
    note: str,
    current_user: dict,
) -> dict:
    """Department or admin updates complaint status."""
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    status_entry = {
        "status": new_status,
        "note": note,
        "updated_by": current_user["sub"],
        "updated_at": datetime.utcnow(),
    }

    update_fields: dict = {
        "status": new_status,
        "updated_at": datetime.utcnow(),
    }
    if new_status in (ComplaintStatus.resolved, ComplaintStatus.closed):
        update_fields["resolution_note"] = note

    await db["complaints"].update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": update_fields, "$push": {"status_history": status_entry}},
    )

    # Notify student
    try:
        student = await db["users"].find_one({"_id": ObjectId(complaint["student_id"])})
        if student:
            await send_status_update_email(
                student["email"], student["name"], complaint["title"], new_status, note
            )
    except Exception:
        pass

    updated = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    return _serialize(updated)


async def delete_complaint(complaint_id: str, current_user: dict) -> dict:
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    # Only admin or the student owner can delete
    if current_user["role"] == "student" and complaint["student_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Access denied.")

    await db["complaints"].delete_one({"_id": ObjectId(complaint_id)})
    return {"message": "Complaint deleted successfully."}


async def reraise_complaint(complaint_id: str, current_user: dict) -> dict:
    """Student re-raises a pending complaint to alert admin."""
    db = get_db()
    complaint = await db["complaints"].find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    if complaint["student_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Access denied.")

    if complaint["status"] != ComplaintStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending complaints can be re-raised.")

    status_entry = {
        "status": complaint["status"],
        "note": "Re-raised by student (Reminder to admin)",
        "updated_by": current_user["sub"],
        "updated_at": datetime.utcnow(),
    }

    await db["complaints"].update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {"updated_at": datetime.utcnow()},
            "$push": {"status_history": status_entry},
        },
    )

    return {"message": "Complaint re-raised successfully."}


async def get_admin_stats(current_user: dict) -> dict:
    db = get_db()
    total = await db["complaints"].count_documents({})
    pending = await db["complaints"].count_documents({"status": "pending"})
    in_progress = await db["complaints"].count_documents({"status": "in_progress"})
    resolved = await db["complaints"].count_documents({"status": "resolved"})
    by_category = {}
    for cat in ["infrastructure", "transportation", "housing", "sanitation", "library", "healthcare", "other"]:
        by_category[cat] = await db["complaints"].count_documents({"category": cat})
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "by_category": by_category,
    }
