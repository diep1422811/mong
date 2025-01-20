from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review
from app.models.story import Story
from app.schemas.review_schema import ReviewCreate, ReviewUpdate


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_review(
        self, story_id: int, review_data: ReviewCreate, user_id: int
    ) -> Review:
        try:
            # Check if user already reviewed this story
            existing_review = await self._get_user_review(story_id, user_id)
            if existing_review:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You have already reviewed this story",
                )

            # Create review
            review = Review(
                user_id=user_id, story_id=story_id, **review_data.model_dump()
            )
            self.db.add(review)

            # Update story rating average
            await self._update_story_rating(story_id)

            await self.db.commit()
            await self.db.refresh(review)
            return review

        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Error creating review"
            )

    async def get_story_reviews(
        self, story_id: int, skip: int = 0, limit: int = 10
    ) -> list[Review]:
        query = (
            select(Review).filter(Review.story_id == story_id).offset(skip).limit(limit)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def update_review(
        self, review_id: int, review_data: ReviewUpdate, user_id: int
    ) -> Review:
        review = await self._get_review_by_id(review_id)

        if review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this review",
            )

        # Update review fields
        for field, value in review_data.model_dump(exclude_unset=True).items():
            setattr(review, field, value)

        # Update story rating average
        await self._update_story_rating(review.story_id)

        await self.db.commit()
        await self.db.refresh(review)
        return review

    async def delete_review(self, review_id: int, user_id: int):
        review = await self._get_review_by_id(review_id)

        if review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this review",
            )

        story_id = review.story_id
        await self.db.delete(review)

        # Update story rating average
        await self._update_story_rating(story_id)

        await self.db.commit()

    async def _get_review_by_id(self, review_id: int) -> Review:
        query = select(Review).filter(Review.review_id == review_id)
        result = await self.db.execute(query)
        review = result.scalar_one_or_none()

        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
            )
        return review

    async def _get_user_review(self, story_id: int, user_id: int) -> Review:
        query = select(Review).filter(
            Review.story_id == story_id, Review.user_id == user_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _update_story_rating(self, story_id: int):
        # Calculate new average rating
        query = select(func.avg(Review.rating)).filter(Review.story_id == story_id)
        result = await self.db.execute(query)
        new_rating = result.scalar() or 0.0

        # Update story
        story_query = select(Story).filter(Story.story_id == story_id)
        result = await self.db.execute(story_query)
        story = result.scalar_one_or_none()

        if story:
            story.rating_avg = float(new_rating)
