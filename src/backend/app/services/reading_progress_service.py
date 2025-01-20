from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chapter import Chapter
from app.models.reading_progress import ReadingProgress
from app.models.story import Story


class ReadingProgressService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def update_progress(
        self, story_id: int, chapter_id: int, user_id: int
    ) -> ReadingProgress:
        try:
            # Verify chapter belongs to story
            chapter = await self._get_chapter(chapter_id)
            if not chapter or chapter.story_id != story_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chapter not found in this story",
                )

            # Get existing progress or create new
            progress = await self._get_progress(story_id, user_id)
            if progress:
                progress.chapter_id = chapter_id
            else:
                progress = ReadingProgress(
                    user_id=user_id, story_id=story_id, chapter_id=chapter_id
                )
                self.db.add(progress)

            await self.db.commit()
            await self.db.refresh(progress)
            return progress

        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error updating reading progress",
            )

    async def get_user_progress(
        self, user_id: int, skip: int = 0, limit: int = 10
    ) -> tuple[list[ReadingProgress], int]:
        # Get total count
        count_query = (
            select(func.count())
            .select_from(ReadingProgress)
            .filter(ReadingProgress.user_id == user_id)
        )
        total = await self.db.scalar(count_query)

        # Get progress with pagination
        query = (
            select(ReadingProgress)
            .filter(ReadingProgress.user_id == user_id)
            .order_by(ReadingProgress.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        progress_list = result.scalars().all()

        return progress_list, total

    async def get_story_progress(
        self, story_id: int, user_id: int
    ) -> Optional[ReadingProgress]:
        progress = await self._get_progress(story_id, user_id)
        if not progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No reading progress found for this story",
            )
        return progress

    async def _get_progress(
        self, story_id: int, user_id: int
    ) -> Optional[ReadingProgress]:
        query = select(ReadingProgress).filter(
            ReadingProgress.story_id == story_id, ReadingProgress.user_id == user_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _get_chapter(self, chapter_id: int) -> Optional[Chapter]:
        query = select(Chapter).filter(Chapter.chapter_id == chapter_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
