from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FavoriteResponse(BaseModel):
    favorite_id: int
    user_id: int
    story_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FavoritesList(BaseModel):
    total: int
    items: list[FavoriteResponse]
