from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user_schema import (
    ChangePassword,
    UserProfileResponse,
    UserResponse,
    UserStats,
    UserStoriesResponse,
    UserUpdate,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile with all related data"""
    user_service = UserService(db)
    user = await user_service.get_user_profile(current_user.user_id)
    return user


@router.get("/me/stats", response_model=UserStats)
async def get_current_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's statistics"""
    user_service = UserService(db)
    stats = await user_service.get_user_stats(current_user.user_id)
    return stats


@router.get("/me/stories", response_model=UserStoriesResponse)
async def get_current_user_stories(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's stories with pagination"""
    user_service = UserService(db)
    stories, total = await user_service.get_user_stories(
        current_user.user_id, skip=skip, limit=limit
    )
    return UserStoriesResponse(items=stories, total=total)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get basic profile information for any user"""
    user_service = UserService(db)
    user = await user_service.get_user_profile(user_id)
    return user


@router.get("/{user_id}/stories", response_model=UserStoriesResponse)
async def get_user_stories(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get stories for any user with pagination"""
    user_service = UserService(db)
    stories, total = await user_service.get_user_stories(
        user_id, skip=skip, limit=limit
    )
    return UserStoriesResponse(items=stories, total=total)


@router.patch("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile"""
    user_service = UserService(db)
    user = await user_service.update_user_profile(current_user.user_id, user_data)
    return user


@router.post("/me/change-password", response_model=UserResponse)
async def change_password(
    password_data: ChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change current user's password"""
    user_service = UserService(db)
    user = await user_service.change_password(
        current_user.user_id, password_data.current_password, password_data.new_password
    )
    return user
