from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.enums import StoryStatus
from app.models.user import User
from app.schemas.story_schema import (
    StoryCreate,
    StoryFilter,
    StoryListResponse,
    StoryResponse,
    StoryUpdate,
)
from app.services.story_service import StoryService

router = APIRouter(prefix="/stories", tags=["Stories"])


@router.post("", response_model=StoryResponse)
async def create_story(
    story_data: StoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new story"""
    story_service = StoryService(db)
    story = await story_service.create_story(story_data, current_user.user_id)
    return story


@router.get("", response_model=StoryListResponse)
async def get_stories(
    skip: int = 0,
    limit: int = 10,
    keyword: Optional[str] = None,
    category_ids: List[int] = Query(None),
    status: Optional[StoryStatus] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    max_rating: Optional[float] = Query(None, ge=0, le=5),
    min_chapters: Optional[int] = Query(None, ge=0),
    max_chapters: Optional[int] = Query(None, ge=0),
    author_name: Optional[str] = None,
    user_id: Optional[int] = None,
    sort_by: Optional[str] = Query(
        None, pattern="^(created_at|rating_avg|view_count|total_chapters|updated_at)$"
    ),
    sort_order: Optional[str] = Query(None, pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all stories with filters
    - **skip**: Number of stories to skip (pagination)
    - **limit**: Maximum number of stories to return
    - **keyword**: Search in title, description and author name
    - **category_ids**: Filter by multiple category IDs
    - **status**: Filter by story status (ONGOING, COMPLETED, DROPPED)
    - **min_rating/max_rating**: Filter by rating range (0-5)
    - **min_chapters/max_chapters**: Filter by chapter count
    - **author_name**: Filter by author name
    - **user_id**: Filter by user who posted the story
    - **sort_by**: Sort by field (created_at, rating_avg, view_count, total_chapters, updated_at)
    - **sort_order**: Sort order (asc, desc)
    """
    filters = StoryFilter(
        keyword=keyword,
        category_ids=category_ids,
        status=status,
        min_rating=min_rating,
        max_rating=max_rating,
        min_chapters=min_chapters,
        max_chapters=max_chapters,
        author_name=author_name,
        user_id=user_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    story_service = StoryService(db)
    stories, total = await story_service.filter_stories(filters, skip, limit)
    return StoryListResponse(items=stories, total=total)


@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(story_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific story by ID"""
    story_service = StoryService(db)
    story = await story_service.get_story(story_id)
    return story


@router.patch("/{story_id}", response_model=StoryResponse)
async def update_story(
    story_id: int,
    story_data: StoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a story"""
    story_service = StoryService(db)
    story = await story_service.update_story(story_id, story_data, current_user.user_id)
    return story


@router.delete("/{story_id}")
async def delete_story(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a story"""
    story_service = StoryService(db)
    await story_service.delete_story(story_id, current_user.user_id)
    return {"message": "Story deleted successfully"}
