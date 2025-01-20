from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReadingProgressResponse(BaseModel):
    progress_id: int
    user_id: int
    story_id: int
    chapter_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReadingProgressList(BaseModel):
    total: int
    items: list[ReadingProgressResponse]
