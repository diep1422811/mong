from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.comment import Comment
from app.schemas.comment_schema import CommentCreate, CommentUpdate


class CommentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(
        self, chapter_id: int, comment_data: CommentCreate, user_id: int
    ) -> Comment:
        try:
            # Verify parent comment if provided
            if comment_data.parent_id:
                parent_comment = await self._get_comment_by_id(comment_data.parent_id)
                if parent_comment.chapter_id != chapter_id:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Parent comment must be from the same chapter",
                    )

            comment = Comment(
                user_id=user_id, chapter_id=chapter_id, **comment_data.model_dump()
            )
            self.db.add(comment)
            await self.db.commit()
            await self.db.refresh(comment)
            return comment

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def get_chapter_comments(
        self, chapter_id: int, skip: int = 0, limit: int = 10
    ) -> list[Comment]:
        query = (
            select(Comment)
            .options(selectinload(Comment.replies))
            .filter(
                Comment.chapter_id == chapter_id,
                Comment.parent_id.is_(None),  # Get only parent comments
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return result.scalars().unique().all()

    async def update_comment(
        self, comment_id: int, comment_data: CommentUpdate, user_id: int
    ) -> Comment:
        comment = await self._get_comment_by_id(comment_id)

        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this comment",
            )

        comment.content = comment_data.content
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def delete_comment(self, comment_id: int, user_id: int):
        comment = await self._get_comment_by_id(comment_id)

        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this comment",
            )

        await self.db.delete(comment)
        await self.db.commit()

    async def _get_comment_by_id(self, comment_id: int) -> Comment:
        query = (
            select(Comment)
            .options(selectinload(Comment.replies))
            .filter(Comment.comment_id == comment_id)
        )
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()

        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found"
            )
        return comment
