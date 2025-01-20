from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.user import User
from app.schemas.admin_schema import AdminUserCreate


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_users(self, skip: int = 0, limit: int = 10) -> list[User]:
        query = select(User).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_user_by_id(self, user_id: int) -> User:
        query = select(User).where(User.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_user_status(self, user_id: int, new_status: UserStatus) -> User:
        try:
            query = select(User).where(User.user_id == int(user_id))
            result = await self.db.execute(query)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            user.status = new_status
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format"
            )

    async def delete_user(self, user_id: int):
        try:
            query = select(User).where(User.user_id == int(user_id))
            result = await self.db.execute(query)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            await self.db.delete(user)
            await self.db.commit()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format"
            )

    async def create_user(self, user_data: AdminUserCreate) -> User:
        # Check if email exists
        query = select(User).where(User.email == user_data.email)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Check if username exists
        query = select(User).where(User.username == user_data.username)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

        # Create user
        user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=get_password_hash(user_data.password),
            role=user_data.role,
            status=user_data.status,
        )

        try:
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}",
            )
