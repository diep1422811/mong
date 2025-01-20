from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import UserRole, UserStatus


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        default=UserRole.USER, server_default=UserRole.USER.value
    )
    status: Mapped[UserStatus] = mapped_column(
        default=UserStatus.ACTIVE, server_default=UserStatus.ACTIVE.value
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    stories: Mapped[List["Story"]] = relationship(back_populates="user")
    reviews: Mapped[List["Review"]] = relationship(back_populates="user")
    favorites: Mapped[List["Favorite"]] = relationship(back_populates="user")
    reading_progress: Mapped[List["ReadingProgress"]] = relationship(
        back_populates="user"
    )
    comments: Mapped[List["Comment"]] = relationship(back_populates="user")
    reports: Mapped[List["Report"]] = relationship(back_populates="reporter")
