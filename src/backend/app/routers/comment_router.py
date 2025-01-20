from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.comment_schema import CommentCreate, CommentResponse, CommentUpdate
from app.services.comment_service import CommentService

router = APIRouter(
    prefix="/stories/{story_id}/chapters/{chapter_id}/comments", tags=["Comments"]
)


@router.post("", response_model=CommentResponse)
async def create_comment(
    story_id: int,
    chapter_id: int,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new comment for a chapter"""
    comment_service = CommentService(db)
    comment = await comment_service.create_comment(
        chapter_id, comment_data, current_user.user_id
    )
    return comment


@router.get("", response_model=list[CommentResponse])
async def get_chapter_comments(
    story_id: int,
    chapter_id: int,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get all comments for a chapter"""
    comment_service = CommentService(db)
    comments = await comment_service.get_chapter_comments(chapter_id, skip, limit)
    return comments


@router.patch("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    story_id: int,
    chapter_id: int,
    comment_id: int,
    comment_data: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a comment"""
    comment_service = CommentService(db)
    comment = await comment_service.update_comment(
        comment_id, comment_data, current_user.user_id
    )
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    story_id: int,
    chapter_id: int,
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a comment"""
    comment_service = CommentService(db)
    await comment_service.delete_comment(comment_id, current_user.user_id)
