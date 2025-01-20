from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ChapterBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    chapter_number: int = Field(..., gt=0)


class ChapterCreate(ChapterBase):
    pass


class ChapterUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)


class ChapterResponse(ChapterBase):
    chapter_id: int
    story_id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChapterListResponse(BaseModel):
    items: list[ChapterResponse]
    total: int

    class Config:
        from_attributes = True
