from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Favorite(Base):
    __tablename__ = "favorites"

    favorite_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    story_id: Mapped[int] = mapped_column(
        ForeignKey("stories.story_id", ondelete="CASCADE")
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="favorites")
    story: Mapped["Story"] = relationship(back_populates="favorites")

    # Sửa unique constraint
    __table_args__ = (
        UniqueConstraint("user_id", "story_id", name="uq_user_story_favorite"),
    )
