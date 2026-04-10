from fastapi import APIRouter, Depends
from app.controllers import notification_controller
from app.middleware.auth import get_current_active_user
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
async def get_notifications(unread: bool = True, current_user: dict = Depends(get_current_active_user)):
    return await notification_controller.get_user_notifications(current_user["sub"], unread)

@router.post("/{notification_id}/read")
async def mark_read(notification_id: str, current_user: dict = Depends(get_current_active_user)):
    await notification_controller.mark_as_read(notification_id, current_user["sub"])
    return {"message": "Notification marked as read"}

@router.post("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_active_user)):
    await notification_controller.mark_all_as_read(current_user["sub"])
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
async def delete_notif(notification_id: str, current_user: dict = Depends(get_current_active_user)):
    await notification_controller.delete_notification(notification_id, current_user["sub"])
    return {"message": "Notification deleted"}
