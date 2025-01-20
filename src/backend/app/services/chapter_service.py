from typing import List, Tuple

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chapter import Chapter
from app.models.story import Story
from app.schemas.chapter_schema import ChapterCreate, ChapterUpdate


class ChapterService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chapter(
        self, story_id: int, chapter_data: ChapterCreate, user_id: int
    ) -> Chapter:
        # Verify story exists and user owns it
        story = await self._verify_story_ownership(story_id, user_id)

        # Create chapter
        chapter = Chapter(story_id=story_id, **chapter_data.model_dump())

        # Update story's total chapters
        story.total_chapters += 1

        self.db.add(chapter)
        await self.db.commit()
        await self.db.refresh(chapter)
        return chapter

    async def get_chapter(self, chapter_id: int) -> Chapter:
        chapter = await self._get_chapter_by_id(chapter_id)
        return chapter

    async def update_chapter(
        self, chapter_id: int, chapter_data: ChapterUpdate, user_id: int
    ) -> Chapter:
        chapter = await self._get_chapter_by_id(chapter_id)

        # Verify ownership
        await self._verify_story_ownership(chapter.story_id, user_id)

        # Update chapter fields
        for field, value in chapter_data.model_dump(exclude_unset=True).items():
            setattr(chapter, field, value)

        await self.db.commit()
        await self.db.refresh(chapter)
        return chapter

    async def delete_chapter(self, chapter_id: int, user_id: int):
        chapter = await self._get_chapter_by_id(chapter_id)

        # Verify ownership
        story = await self._verify_story_ownership(chapter.story_id, user_id)

        # Update story's total chapters
        story.total_chapters -= 1

        await self.db.delete(chapter)
        await self.db.commit()

    async def _get_chapter_by_id(self, chapter_id: int) -> Chapter:
        query = select(Chapter).where(Chapter.chapter_id == chapter_id)
        result = await self.db.execute(query)
        chapter = result.scalar_one_or_none()

        if not chapter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found"
            )
        return chapter

    async def _verify_story_ownership(self, story_id: int, user_id: int) -> Story:
        query = select(Story).where(Story.story_id == story_id)
        result = await self.db.execute(query)
        story = result.scalar_one_or_none()

        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Story not found"
            )

        if story.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this story's chapters",
            )

        return story

    async def get_story_chapters(
        self, story_id: int, skip: int = 0, limit: int = 10
    ) -> Tuple[List[Chapter], int]:
        # Base query
        query = (
            select(Chapter)
            .filter(Chapter.story_id == story_id)
            .order_by(Chapter.chapter_number.asc())
        )

        # Count query
        count_query = (
            select(func.count())
            .select_from(Chapter)
            .filter(Chapter.story_id == story_id)
        )

        # Get total count
        total = await self.db.scalar(count_query)

        # Apply pagination
        query = query.offset(skip).limit(limit)

        # Execute query
        result = await self.db.execute(query)
        chapters = result.scalars().all()

        return chapters, total
