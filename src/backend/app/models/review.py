from sqlalchemy import CheckConstraint, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Review(Base):
    __tablename__ = "reviews"

    review_id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text)

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    story_id: Mapped[int] = mapped_column(
        ForeignKey("stories.story_id", ondelete="CASCADE")
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="reviews")
    story: Mapped["Story"] = relationship(back_populates="reviews")

    # Constraints
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="valid_rating"),
        UniqueConstraint("user_id", "story_id", name="uq_user_story_review"),
    )
