from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.enums import ReportStatus
from app.schemas.story_schema import StoryResponse


class ReportBase(BaseModel):
    reason: str = Field(..., min_length=1)


class ReportCreate(ReportBase):
    reason: str = Field(..., min_length=1)  # Người báo cáo nhập lý do
    story_id: int  # ID của câu chuyện bị báo cáo


class ReportUpdate(BaseModel):
    status: ReportStatus
    admin_note: Optional[str] = None
    email_content: Optional[str] = None


class ReportResponse(ReportBase):
    report_id: int
    status: ReportStatus
    admin_note: Optional[str]
    reporter_id: int
    story_id: int
    story: StoryResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReportList(BaseModel):
    total: int
    items: list[ReportResponse]
