from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.review_schema import ReviewCreate, ReviewResponse, ReviewUpdate
from app.services.review_service import ReviewService

router = APIRouter(prefix="/stories/{story_id}/reviews", tags=["Reviews"])


@router.post("", response_model=ReviewResponse)
async def create_review(
    story_id: int,
    review_data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new review for a story"""
    review_service = ReviewService(db)
    review = await review_service.create_review(
        story_id, review_data, current_user.user_id
    )
    return review


@router.get("", response_model=list[ReviewResponse])
async def get_story_reviews(
    story_id: int,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get all reviews for a story"""
    review_service = ReviewService(db)
    reviews = await review_service.get_story_reviews(story_id, skip, limit)
    return reviews


@router.patch("/{review_id}", response_model=ReviewResponse)
async def update_review(
    story_id: int,
    review_id: int,
    review_data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a review"""
    review_service = ReviewService(db)
    review = await review_service.update_review(
        review_id, review_data, current_user.user_id
    )
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    story_id: int,
    review_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a review"""
    review_service = ReviewService(db)
    await review_service.delete_review(review_id, current_user.user_id)
