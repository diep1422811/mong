from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import UserRole, UserStatus


class AdminFilter(BaseModel):
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None


class AdminStats(BaseModel):
    total_active_users: int
    total_inactive_users: int
    total_banned_users: int
    new_users_today: int
    new_users_this_week: int
    new_users_this_month: int


class AdminLog(BaseModel):
    admin_id: int
    action: str
    target_id: Optional[int] = None
    target_type: str
    details: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now())

    class Config:
        from_attributes = True


class AdminUserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=5)
    role: UserRole = Field(default=UserRole.USER)
    status: UserStatus = Field(default=UserStatus.ACTIVE)
