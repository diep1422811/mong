from typing import List, Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import CategoryType


class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    type: Mapped[CategoryType] = mapped_column(
        default=CategoryType.CATEGORY,
        server_default=CategoryType.CATEGORY.value,
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(Text)
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.category_id", ondelete="CASCADE")
    )

    # Relationships
    stories: Mapped[List["Story"]] = relationship(
        secondary="story_categories", back_populates="categories"
    )
    children: Mapped[List["Category"]] = relationship(
        "Category",
        back_populates="parent_category",
        cascade="all, delete",
        remote_side=[category_id],
    )
    parent_category: Mapped[Optional["Category"]] = relationship(
        "Category", back_populates="children", remote_side=[parent_id]
    )
