from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.enums import StoryStatus


class StoryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    author_name: str = Field(..., min_length=1, max_length=100)
    status: StoryStatus = Field(default=StoryStatus.ONGOING)
    category_ids: List[int] = Field(default_factory=list)


class StoryCreate(StoryBase):
    pass


class StoryUpdate(StoryBase):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author_name: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[StoryStatus] = None


class StoryResponse(StoryBase):
    story_id: int
    slug: str
    cover_image_url: Optional[str]
    view_count: int
    rating_avg: float
    total_chapters: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StoryFilter(BaseModel):
    keyword: Optional[str] = None
    category_ids: Optional[List[int]] = None
    status: Optional[StoryStatus] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_rating: Optional[float] = Field(None, ge=0, le=5)
    min_chapters: Optional[int] = Field(None, ge=0)
    max_chapters: Optional[int] = Field(None, ge=0)
    author_name: Optional[str] = None
    user_id: Optional[int] = None
    sort_by: Optional[str] = Field(
        None, pattern="^(created_at|rating_avg|view_count|total_chapters|updated_at)$"
    )
    sort_order: Optional[str] = Field(None, pattern="^(asc|desc)$")


class StoryListResponse(BaseModel):
    items: list[StoryResponse]
    total: int

    class Config:
        from_attributes = True
