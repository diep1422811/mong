from typing import List, Optional

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import StoryStatus


class Story(Base):
    __tablename__ = "stories"

    story_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(255))
    author_name: Mapped[str] = mapped_column(String(100))
    status: Mapped[StoryStatus] = mapped_column(
        default=StoryStatus.ONGOING, server_default=StoryStatus.ONGOING.value
    )
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    rating_avg: Mapped[float] = mapped_column(
        Numeric(3, 2), default=0.0, server_default="0.0"
    )
    total_chapters: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    report_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="stories")
    chapters: Mapped[List["Chapter"]] = relationship(back_populates="story")
    categories: Mapped[List["Category"]] = relationship(
        secondary="story_categories", back_populates="stories"
    )
    reviews: Mapped[List["Review"]] = relationship(back_populates="story")
    favorites: Mapped[List["Favorite"]] = relationship(back_populates="story")
    reading_progress: Mapped[List["ReadingProgress"]] = relationship(
        back_populates="story"
    )
    reports: Mapped[List["Report"]] = relationship(back_populates="story")
