from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.schemas.story_schema import StoryResponse
from app.schemas.user_schema import UserResponse


class DashboardStats(BaseModel):
    total_users: int
    new_users: int
    total_stories: int
    new_stories: int
    total_pageviews: int
    period_start: datetime
    period_end: datetime


class DashboardRecentData(BaseModel):
    recent_users: List[UserResponse]
    recent_stories: List[StoryResponse]


class ChartSeries(BaseModel):
    name: str  # Tên của từng series (e.g., "Users", "Stories", "Pageviews")
    data: List[int]  # Danh sách dữ liệu theo từng khoảng thời gian


class ChartDataResponse(BaseModel):
    categories: List[str]  # Danh sách các khoảng thời gian (e.g., "10:00", "11:00", ...)
    series: List[ChartSeries]  # Danh sách các series dữ liệu
