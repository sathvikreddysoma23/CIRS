from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import verify_access_token
from app.database import get_db
from bson import ObjectId

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    """Decode JWT and return the current user payload."""
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload   # { sub: user_id, role: ..., email: ... }


import time
from typing import Dict, Tuple

# Simple in-memory cache to store user active status and avoid redundant DB hits
# Format: { user_id: (is_active, timestamp) }
USER_STATUS_CACHE: Dict[str, Tuple[bool, float]] = {}
CACHE_TTL_SECONDS = 60


async def get_current_active_user(
    current_user: dict = Depends(get_current_user),
):
    """Ensure the authenticated user still exists and is active."""
    user_id = current_user["sub"]
    now = time.time()

    # Check cache first
    if user_id in USER_STATUS_CACHE:
        is_active, timestamp = USER_STATUS_CACHE[user_id]
        if now - timestamp < CACHE_TTL_SECONDS:
            if not is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is inactive.",
                )
            return current_user

    # Cache miss or expired - hit the DB
    db = get_db()
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    
    is_active = bool(user and user.get("is_active", True))
    USER_STATUS_CACHE[user_id] = (is_active, now)

    if not user or not is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User account is inactive or not found. ID: {user_id}",
        )
    return current_user


def require_role(*roles: str):
    """Role-based dependency factory. Usage: Depends(require_role('admin'))."""
    async def role_checker(current_user: dict = Depends(get_current_active_user)):
        if current_user.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {', '.join(roles)}.",
            )
        return current_user
    return role_checker


# Convenience aliases
require_admin = require_role("admin")
require_student = require_role("student")
require_department = require_role("department")
require_admin_or_department = require_role("admin", "department")
