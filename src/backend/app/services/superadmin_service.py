import os
import shutil

from datetime import datetime, timezone
from typing import Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import UserRole
from app.models.story import Story
from app.models.user import User


class SuperAdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def update_user_role(self, user_id: int, new_role: UserRole) -> User:
        try:
            query = select(User).where(User.user_id == int(user_id))  # Convert to int
            result = await self.db.execute(query)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            user.role = new_role
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format"
            )

    async def get_system_stats(self):
        # Get total users
        users_query = select(func.count(User.user_id))
        total_users = await self.db.execute(users_query)

        # Get total stories
        stories_query = select(func.count(Story.story_id))
        total_stories = await self.db.execute(stories_query)

        return {
            "total_users": total_users.scalar(),
            "total_stories": total_stories.scalar(),
            "system_status": "healthy",
        }

    async def create_backup(self):
        # Logic sao lưu
        backup_dir = "/path/to/backup"  # Đường dẫn sao lưu (có thể thay đổi tuỳ ý)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_folder = os.path.join(backup_dir, f"backup_{timestamp}")
        
        try:
            # Tạo thư mục sao lưu mới
            os.makedirs(backup_folder)

            # Sao lưu các tệp hoặc cơ sở dữ liệu
            # Ví dụ: sao lưu dữ liệu từ thư mục `data` vào thư mục sao lưu
            shutil.copytree("/path/to/data", backup_folder)

            # Trả về thông tin sao lưu
            return {
                
                "message": "Backup created successfully",
                "backup_path": backup_folder,
                "timestamp": datetime.now(),
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")


    async def get_all_users(
        self, skip: int = 0, limit: int = 10, role: Optional[UserRole] = None
    ) -> Tuple[list[User], int]:
        # Base query
        query = select(User)
        count_query = select(func.count()).select_from(User)

        # Add role filter if provided
        if role:
            query = query.filter(User.role == role)
            count_query = count_query.filter(User.role == role)

        # Get total count
        total = await self.db.scalar(count_query)

        # Get users with pagination
        query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        users = result.scalars().all()

        return users, total
