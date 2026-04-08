from fastapi import APIRouter, Body
from pydantic import BaseModel, EmailStr
from app.controllers import auth_controller
from app.middleware.auth import get_current_active_user
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"
    department: str = None
    phone: str = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ProfileUpdate(BaseModel):
    name: str = None
    phone: str = None
    department: str = None


@router.post("/register", summary="Register a new user")
async def register(body: RegisterRequest):
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
