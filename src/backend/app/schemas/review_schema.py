from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1)


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=1)


class ReviewResponse(ReviewBase):
    review_id: int
    user_id: int
    story_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
