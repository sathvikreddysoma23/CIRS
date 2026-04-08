from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from typing import Optional, List
from pydantic import BaseModel
from app.controllers import complaint_controller
from app.middleware.auth import get_current_active_user, require_admin_or_department, require_admin
from app.models.complaint import ComplaintUpdate, ComplaintCategory, ComplaintPriority

router = APIRouter(prefix="/complaints", tags=["Complaints"])


class AssignBody(BaseModel):
    department_user_id: str


class StatusBody(BaseModel):
    status: str
    note: str = ""


# ──────────────────────────────────────────────────────────────────
# CREATE
# ──────────────────────────────────────────────────────────────────

@router.post("/", summary="Submit a new complaint (student)")
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    location: Optional[str] = Form(None),
    category: ComplaintCategory = Form(ComplaintCategory.other),
    priority: ComplaintPriority = Form(ComplaintPriority.medium),
    images: Optional[List[UploadFile]] = File(None),
    current_user: dict = Depends(get_current_active_user),
):
    from app.models.complaint import ComplaintCreate
    data = ComplaintCreate(
        title=title,
        description=description,
        location=location,
        category=category,
        priority=priority,
    )
    return await complaint_controller.create_complaint(data, current_user, images)


# ──────────────────────────────────────────────────────────────────
# READ
# ──────────────────────────────────────────────────────────────────

@router.get("/", summary="List complaints (scoped by role)")
async def list_complaints(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    return await complaint_controller.get_complaints(
        current_user, status, category, priority, page, limit
    )


@router.get("/stats", summary="Get admin complaint statistics")
async def complaint_stats(current_user: dict = Depends(require_admin)):
    return await complaint_controller.get_admin_stats(current_user)


@router.get("/{complaint_id}", summary="Get a single complaint by ID")
async def get_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    return await complaint_controller.get_complaint_by_id(complaint_id, current_user)


# ──────────────────────────────────────────────────────────────────
# UPDATE / DELETE
# ──────────────────────────────────────────────────────────────────

@router.put("/{complaint_id}", summary="Edit complaint (student, pending only)")
async def update_complaint(
    complaint_id: str,
    body: ComplaintUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    return await complaint_controller.update_complaint(complaint_id, body, current_user)


@router.delete("/{complaint_id}", summary="Delete a complaint")
async def delete_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    return await complaint_controller.delete_complaint(complaint_id, current_user)


# ──────────────────────────────────────────────────────────────────
# ADMIN / DEPARTMENT ACTIONS
# ──────────────────────────────────────────────────────────────────

@router.post("/{complaint_id}/assign", summary="Assign complaint to a department (admin only)")
async def assign_complaint(
    complaint_id: str,
    body: AssignBody,
    current_user: dict = Depends(require_admin),
):
    return await complaint_controller.assign_complaint(
        complaint_id, body.department_user_id, current_user
    )


@router.post("/{complaint_id}/status", summary="Update complaint status (admin or department)")
async def update_status(
    complaint_id: str,
    body: StatusBody,
    current_user: dict = Depends(require_admin_or_department),
):
    return await complaint_controller.update_complaint_status(
        complaint_id, body.status, body.note, current_user
    )
