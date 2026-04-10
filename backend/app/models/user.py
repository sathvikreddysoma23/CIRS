from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class UserRole(str, Enum):
    student = "student"
    admin = "admin"
    department = "department"
    driver = "driver"


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.student
    department: Optional[str] = None   # only for department users
    phone: Optional[str] = None
    is_active: bool = True

    class Config:
        use_enum_values = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    secret_key: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UserResponse(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
