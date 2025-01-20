from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import ReportStatus


class Report(Base):
    __tablename__ = "reports"

    report_id: Mapped[int] = mapped_column(primary_key=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ReportStatus] = mapped_column(
        default=ReportStatus.IN_PROGRESS,
        server_default=ReportStatus.IN_PROGRESS.value,
    )
    admin_note: Mapped[Optional[str]] = mapped_column(Text)

    # Foreign Keys
    reporter_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    story_id: Mapped[int] = mapped_column(
        ForeignKey("stories.story_id", ondelete="CASCADE")
    )

    # Relationships
    reporter: Mapped["User"] = relationship(back_populates="reports")
    story: Mapped["Story"] = relationship(back_populates="reports")
