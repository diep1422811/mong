from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.reading_progress_schema import (
    ReadingProgressList,
    ReadingProgressResponse,
)
from app.services.reading_progress_service import ReadingProgressService

router = APIRouter(prefix="/reading-progress", tags=["Reading Progress"])


@router.post(
    "/stories/{story_id}/chapters/{chapter_id}", response_model=ReadingProgressResponse
)
async def update_reading_progress(
    story_id: int,
    chapter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update user's reading progress for a story"""
    progress_service = ReadingProgressService(db)
    progress = await progress_service.update_progress(
        story_id, chapter_id, current_user.user_id
    )
    return progress


@router.get("", response_model=ReadingProgressList)
async def get_user_reading_progress(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's reading progress for all stories"""
    progress_service = ReadingProgressService(db)
    progress_list, total = await progress_service.get_user_progress(
        current_user.user_id, skip, limit
    )
    return ReadingProgressList(total=total, items=progress_list)


@router.get("/stories/{story_id}", response_model=ReadingProgressResponse)
async def get_story_reading_progress(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's reading progress for a specific story"""
    progress_service = ReadingProgressService(db)
    progress = await progress_service.get_story_progress(story_id, current_user.user_id)
    return progress
