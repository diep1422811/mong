from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.chapter_schema import (
    ChapterCreate,
    ChapterListResponse,
    ChapterResponse,
    ChapterUpdate,
)
from app.services.chapter_service import ChapterService

router = APIRouter(prefix="/stories/{story_id}/chapters", tags=["Chapters"])


@router.post("", response_model=ChapterResponse)
async def create_chapter(
    story_id: int,
    chapter_data: ChapterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new chapter for a story"""
    chapter_service = ChapterService(db)
    chapter = await chapter_service.create_chapter(
        story_id, chapter_data, current_user.user_id
    )
    return chapter


@router.get("/{chapter_id}", response_model=ChapterResponse)
async def get_chapter(
    story_id: int,
    chapter_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific chapter"""
    chapter_service = ChapterService(db)
    chapter = await chapter_service.get_chapter(chapter_id)
    if chapter.story_id != story_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found in this story",
        )
    return chapter


@router.patch("/{chapter_id}", response_model=ChapterResponse)
async def update_chapter(
    story_id: int,
    chapter_id: int,
    chapter_data: ChapterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a chapter"""
    chapter_service = ChapterService(db)
    chapter = await chapter_service.update_chapter(
        chapter_id, chapter_data, current_user.user_id
    )
    if chapter.story_id != story_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found in this story",
        )
    return chapter


@router.delete("/{chapter_id}")
async def delete_chapter(
    story_id: int,
    chapter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a chapter"""
    chapter_service = ChapterService(db)
    await chapter_service.delete_chapter(chapter_id, current_user.user_id)
    return {"message": "Chapter deleted successfully"}


@router.get("", response_model=ChapterListResponse)
async def get_story_chapters(
    story_id: int,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get all chapters of a story with pagination"""
    chapter_service = ChapterService(db)
    chapters, total = await chapter_service.get_story_chapters(story_id, skip, limit)
    return ChapterListResponse(items=chapters, total=total)
