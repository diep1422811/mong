from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_password_hash, verify_password
from app.models.favorite import Favorite
from app.models.reading_progress import ReadingProgress
from app.models.review import Review
from app.models.story import Story
from app.models.user import User
from app.schemas.user_schema import UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_profile(self, user_id: int) -> User:
        """Get user profile with all related data"""
        query = (
            select(User)
            .options(
                selectinload(User.stories),
                selectinload(User.reviews),
                selectinload(User.favorites),
                selectinload(User.reading_progress),
                selectinload(User.comments),
                selectinload(User.reports),
            )
            .filter(User.user_id == user_id)
        )
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def get_user_stats(self, user_id: int) -> dict:
        """Get user statistics"""
        # Get story count
        story_count = await self.db.scalar(
            select(func.count(Story.story_id)).filter(Story.user_id == user_id)
        )

        # Get review count
        review_count = await self.db.scalar(
            select(func.count(Review.review_id)).filter(Review.user_id == user_id)
        )

        # Get favorite count
        favorite_count = await self.db.scalar(
            select(func.count(Favorite.favorite_id)).filter(Favorite.user_id == user_id)
        )

        # Get reading progress count
        reading_count = await self.db.scalar(
            select(func.count(ReadingProgress.progress_id)).filter(
                ReadingProgress.user_id == user_id
            )
        )

        return {
            "total_stories": story_count,
            "total_reviews": review_count,
            "total_favorites": favorite_count,
            "total_reading": reading_count,
        }

    async def update_user_profile(self, user_id: int, user_data: UserUpdate) -> User:
        """Update user profile"""
        user = await self._get_user(user_id)

        # Check if email is being updated and is unique
        if user_data.email and user_data.email != user.email:
            await self._check_email_exists(user_data.email)

        # Check if username is being updated and is unique
        if user_data.username and user_data.username != user.username:
            await self._check_username_exists(user_data.username)

        # Update user fields
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        try:
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error updating profile: {str(e)}",
            )

    async def get_user_stories(
        self, user_id: int, skip: int = 0, limit: int = 10
    ) -> tuple[list[Story], int]:
        """Get user's stories with pagination"""
        # Get total count
        total = await self.db.scalar(
            select(func.count()).select_from(Story).filter(Story.user_id == user_id)
        )

        # Get stories
        query = (
            select(Story)
            .filter(Story.user_id == user_id)
            .options(
                selectinload(Story.categories),
                selectinload(Story.reviews),
            )
            .order_by(Story.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        stories = result.scalars().all()

        return stories, total

    async def _get_user(self, user_id: int) -> User:
        """Helper method to get user by ID"""
        query = select(User).filter(User.user_id == user_id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def _check_email_exists(self, email: str):
        """Check if email already exists"""
        query = select(User).filter(User.email == email)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    async def _check_username_exists(self, username: str):
        """Check if username already exists"""
        query = select(User).filter(User.username == username)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

    async def change_password(
        self, user_id: int, current_password: str, new_password: str
    ) -> User:
        """Change user password"""
        user = await self._get_user(user_id)

        # Verify current password
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        # Update password
        user.password_hash = get_password_hash(new_password)

        try:
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error changing password: {str(e)}",
            )
