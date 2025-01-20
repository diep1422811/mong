from sqlalchemy import Column, ForeignKey, Table

from app.models.base import Base

story_categories = Table(
    "story_categories",
    Base.metadata,
    Column(
        "story_id", ForeignKey("stories.story_id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "category_id",
        ForeignKey("categories.category_id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
