from typing import List, Optional

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Comment(Base):
    __tablename__ = "comments"

    comment_id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("comments.comment_id", ondelete="CASCADE"), nullable=True
    )

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    chapter_id: Mapped[int] = mapped_column(
        ForeignKey("chapters.chapter_id", ondelete="CASCADE")
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="comments")
    chapter: Mapped["Chapter"] = relationship(back_populates="comments")

    # Self-referential relationship
    replies: Mapped[List["Comment"]] = relationship(
        "Comment",
        back_populates="parent",
        cascade="all, delete",  # Removed delete-orphan
        remote_side=[comment_id],
    )
    parent: Mapped[Optional["Comment"]] = relationship(
        "Comment", back_populates="replies", remote_side=[parent_id]
    )
