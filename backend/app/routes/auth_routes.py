from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from app.controllers import auth_controller
from app.middleware.auth import get_current_active_user
from app.models.user import UserCreate

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ProfileUpdate(BaseModel):
    name: str = None
    phone: str = None
    department: str = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


@router.post("/register", summary="Register a new user")
async def register(body: UserCreate):
    return await auth_controller.register_user(body)


@router.post("/login", summary="Login and get JWT tokens")
async def login(body: LoginRequest):
    return await auth_controller.login_user(body.email, body.password)


@router.post("/refresh", summary="Get new access token using refresh token")
async def refresh(body: RefreshRequest):
    return await auth_controller.refresh_access_token(body.refresh_token)


@router.get("/me", summary="Get current user profile")
async def get_me(current_user: dict = Depends(get_current_active_user)):
    return await auth_controller.get_user_profile(current_user["sub"])


@router.put("/me", summary="Update current user profile")
async def update_me(body: ProfileUpdate, current_user: dict = Depends(get_current_active_user)):
    return await auth_controller.update_user_profile(current_user["sub"], body.model_dump())


@router.post("/change-password", summary="Change password for current user")
async def change_password(body: PasswordChange, current_user: dict = Depends(get_current_active_user)):
    return await auth_controller.change_password(current_user["sub"], body.old_password, body.new_password)
