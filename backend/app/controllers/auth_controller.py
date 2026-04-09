from fastapi import HTTPException, status
from app.database import get_db
from app.models.user import UserCreate, UserInDB
from app.utils.password import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token, verify_refresh_token
from bson import ObjectId
from datetime import datetime


import logging
logger = logging.getLogger(__name__)

async def register_user(user_data: UserCreate) -> dict:
    logger.info(f"Registering user: {user_data.email}")
    db = get_db()
    
    # Check duplicate email
    logger.info("Checking for existing email...")
    existing = await db["users"].find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    # Secret Key Validation
    if user_data.role == "admin":
        if user_data.secret_key != "admin123":
            raise HTTPException(status_code=403, detail="Invalid secret key for admin registration.")
        user_data.department = None
    elif user_data.role == "department":
        if user_data.secret_key != "staf123":
            raise HTTPException(status_code=403, detail="Invalid secret key for staff registration.")

    hashed = hash_password(user_data.password)
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "role": user_data.role,
        "department": user_data.department,
        "phone": user_data.phone,
        "is_active": True,
        "hashed_password": hashed,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db["users"].insert_one(new_user)
    new_user["_id"] = str(result.inserted_id)
    new_user.pop("hashed_password")
    return new_user


async def login_user(email: str, password: str) -> dict:
    db = get_db()
    user = await db["users"].find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated.",
        )

    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "name": user["name"],
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "department": user.get("department"),
        },
    }


async def refresh_access_token(refresh_token: str) -> dict:
    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )
    token_data = {
        "sub": payload["sub"],
        "email": payload["email"],
        "role": payload["role"],
        "name": payload.get("name", ""),
    }
    new_access = create_access_token(token_data)
    return {"access_token": new_access, "token_type": "bearer"}


async def get_user_profile(user_id: str) -> dict:
    db = get_db()
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user["_id"] = str(user["_id"])
    user.pop("hashed_password", None)
    return user


async def update_user_profile(user_id: str, update_data: dict) -> dict:
    db = get_db()
    update_data["updated_at"] = datetime.utcnow()
    update_data = {k: v for k, v in update_data.items() if v is not None}
    await db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    return await get_user_profile(user_id)
