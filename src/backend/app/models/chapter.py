from typing import List

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Chapter(Base):
    __tablename__ = "chapters"

    chapter_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    chapter_number: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Foreign Keys
    story_id: Mapped[int] = mapped_column(
        ForeignKey("stories.story_id", ondelete="CASCADE")
    )

    # Relationships
    story: Mapped["Story"] = relationship(back_populates="chapters")
    comments: Mapped[List["Comment"]] = relationship(back_populates="chapter")
    reading_progress: Mapped[List["ReadingProgress"]] = relationship(
        back_populates="chapter"
    )
