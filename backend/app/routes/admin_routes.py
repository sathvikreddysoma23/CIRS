from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.controllers import admin_controller
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", summary="Get system-wide dashboard overview")
async def dashboard(current_user: dict = Depends(require_admin)):
    return await admin_controller.get_dashboard_overview()


@router.get("/users", summary="List all users (paginated)")
async def list_users(
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_admin),
):
    return await admin_controller.list_users(role, page, limit)


@router.patch("/users/{user_id}/toggle", summary="Activate or deactivate a user")
async def toggle_user(
    user_id: str,
    is_active: bool = Query(...),
    current_user: dict = Depends(require_admin),
):
    return await admin_controller.toggle_user_active(user_id, is_active)


@router.delete("/users/{user_id}", summary="Permanently delete a user")
async def delete_user(user_id: str, current_user: dict = Depends(require_admin)):
    return await admin_controller.delete_user(user_id)
