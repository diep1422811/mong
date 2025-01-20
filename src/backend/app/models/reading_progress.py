from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ReadingProgress(Base):
    __tablename__ = "reading_progress"

    progress_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    story_id: Mapped[int] = mapped_column(
        ForeignKey("stories.story_id", ondelete="CASCADE")
    )
    chapter_id: Mapped[int] = mapped_column(
        ForeignKey("chapters.chapter_id", ondelete="CASCADE")
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="reading_progress")
    story: Mapped["Story"] = relationship(back_populates="reading_progress")
    chapter: Mapped["Chapter"] = relationship(back_populates="reading_progress")

    # Sửa unique constraint
    __table_args__ = (
        UniqueConstraint("user_id", "story_id", name="uq_user_story_progress"),
    )
