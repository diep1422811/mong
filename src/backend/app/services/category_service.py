from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.schemas.category_schema import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_category(self, category_data: CategoryCreate) -> Category:
        try:
            category = Category(**category_data.model_dump())
            self.db.add(category)
            await self.db.commit()
            await self.db.refresh(category)
            return category
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists",
            )

    async def get_categories(self, skip: int = 0, limit: int = 10) -> list[Category]:
        query = select(Category).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_category(self, category_id: int) -> Category:
        query = select(Category).filter(Category.category_id == category_id)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
            )
        return category

    async def update_category(
        self, category_id: int, category_data: CategoryUpdate
    ) -> Category:
        category = await self.get_category(category_id)

        try:
            update_data = category_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(category, field, value)

            await self.db.commit()
            await self.db.refresh(category)
            return category
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists",
            )

    async def delete_category(self, category_id: int):
        category = await self.get_category(category_id)
        await self.db.delete(category)
        await self.db.commit()

    async def seed_categories(self) -> list[Category]:
        try:
            # Import CATEGORIES từ seeder
            from app.seeders.category_seeder import CATEGORIES

            created_categories = []

            # Tạo categories chính trước
            for category_data in CATEGORIES:
                children = category_data.pop("children", [])
                category = Category(**category_data)
                self.db.add(category)
                await self.db.flush()  # Để lấy category_id

                # Tạo sub-categories
                if children:
                    for child_data in children:
                        child_data["parent_id"] = category.category_id
                        child = Category(**child_data)
                        self.db.add(child)

                created_categories.append(category)

            await self.db.commit()
            return created_categories

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error seeding categories: {str(e)}",
            )
