from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import UserRole, UserStatus
from app.schemas.comment_schema import CommentResponse
from app.schemas.favorite_schema import FavoriteResponse
from app.schemas.reading_progress_schema import ReadingProgressResponse
from app.schemas.report_schema import ReportResponse
from app.schemas.review_schema import ReviewResponse
from app.schemas.story_schema import StoryResponse


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Schema for updating user profile"""

    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserResponse(UserBase):
    user_id: int
    avatar_url: Optional[str] = None
    role: UserRole
    status: UserStatus
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    status: UserStatus = Field(..., description="New user status")


class UserRoleUpdate(BaseModel):
    role: UserRole = Field(..., description="New user role")


class SystemStats(BaseModel):
    total_users: int
    total_stories: int
    system_status: str


class BackupResponse(BaseModel):
    message: str
    timestamp: datetime


class AdminUserList(BaseModel):
    users: list[UserResponse]
    total: int
    skip: int
    limit: int

    class Config:
        from_attributes = True


class AdminActionResponse(BaseModel):
    success: bool
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now())


class SuperAdminActionResponse(AdminActionResponse):
    performed_by: str
    action_type: str


class UserProfileResponse(UserResponse):
    """Extended user response with related data"""

    stories: list[StoryResponse] = []
    reviews: list[ReviewResponse] = []
    favorites: list[FavoriteResponse] = []
    reading_progress: list[ReadingProgressResponse] = []
    comments: list[CommentResponse] = []
    reports: list[ReportResponse] = []

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    """User statistics response"""

    total_stories: int
    total_reviews: int
    total_favorites: int
    total_reading: int


class UserStoriesResponse(BaseModel):
    """Paginated user stories response"""

    items: list[StoryResponse]
    total: int


class ChangePassword(BaseModel):
    """Schema for changing password"""

    current_password: str
    new_password: str = Field(..., min_length=5)
