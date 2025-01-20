from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.favorite import Favorite
from app.models.story import Story


class FavoriteService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_favorite(self, story_id: int, user_id: int) -> Favorite:
        try:
            # Verify story exists
            story = await self._get_story(story_id)
            if not story:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Story not found"
                )

            favorite = Favorite(user_id=user_id, story_id=story_id)
            self.db.add(favorite)
            await self.db.commit()
            await self.db.refresh(favorite)
            return favorite

        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Story already in favorites",
            )

    async def remove_favorite(self, story_id: int, user_id: int):
        favorite = await self._get_favorite(story_id, user_id)
        if not favorite:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Story not found in favorites",
            )

        await self.db.delete(favorite)
        await self.db.commit()

    async def get_user_favorites(
        self, user_id: int, skip: int = 0, limit: int = 10
    ) -> tuple[list[Favorite], int]:
        # Get total count
        count_query = (
            select(func.count())
            .select_from(Favorite)
            .filter(Favorite.user_id == user_id)
        )
        total = await self.db.scalar(count_query)

        # Get favorites with pagination
        query = (
            select(Favorite)
            .filter(Favorite.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        favorites = result.scalars().all()

        return favorites, total

    async def _get_favorite(self, story_id: int, user_id: int) -> Optional[Favorite]:
        query = select(Favorite).filter(
            Favorite.story_id == story_id, Favorite.user_id == user_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _get_story(self, story_id: int) -> Optional[Story]:
        query = select(Story).filter(Story.story_id == story_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
