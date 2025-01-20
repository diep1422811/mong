from datetime import datetime, timedelta
from typing import List, Optional, Tuple, Dict

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.chapter import Chapter
from app.models.story import Story
from app.models.user import User


from datetime import datetime, timedelta

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_chart_data(
        self, period: str = "24h", start_date: Optional[datetime] = None, end_date: Optional[datetime] = None
    ) -> Dict:
        now = datetime.utcnow()

        # Xác định khoảng thời gian
        if start_date and end_date:
            period_start = start_date
            period_end = end_date
        else:
            period_end = now
            if period == "24h":
                period_start = now - timedelta(hours=24)
            elif period == "week":
                period_start = now - timedelta(days=7)
            elif period == "month":
                period_start = now - timedelta(days=30)
            else:
                period_start = now - timedelta(hours=24)

        # Tạo danh sách categories dựa trên period
        if period == "24h":
            intervals = [
                (period_start + timedelta(hours=i)).replace(minute=0, second=0, microsecond=0)
                for i in range(24)
            ]
            time_format = "%H:00"
        elif period == "week":
            intervals = [
                period_start + timedelta(days=i) for i in range((period_end - period_start).days + 1)
            ]
            time_format = "%A"
        elif period == "month":
            intervals = [
                period_start + timedelta(days=i) for i in range((period_end - period_start).days + 1)
            ]
            time_format = "%d %b"
        else:
            intervals = []

        categories = [dt.strftime(time_format) for dt in intervals]

        # Lấy tổng số user, truyện, pageviews theo từng interval
        series = {"users": [], "stories": [], "pageviews": []}
        for i in range(len(intervals) - 1):
            start = intervals[i]
            end = intervals[i + 1]

            # Users
            users_count = await self.db.scalar(
                select(func.count()).where(User.created_at.between(start, end))
            )
            series["users"].append(users_count or 0)

            # Stories
            stories_count = await self.db.scalar(
                select(func.count()).where(Story.created_at.between(start, end))
            )
            series["stories"].append(stories_count or 0)

            # Pageviews
            pageviews_count = await self.db.scalar(
                select(func.sum(Story.view_count)).where(Story.updated_at.between(start, end))
            )
            series["pageviews"].append(pageviews_count or 0)

        return {
            "categories": categories,
            "series": [
                {"name": "Users", "data": series["users"]},
                {"name": "Stories", "data": series["stories"]},
                {"name": "Pageviews", "data": series["pageviews"]},
            ],
        }


    async def get_recent_data(self) -> Tuple[List[User], List[Story]]:
        # Lấy users trong 24h gần nhất
        recent_users_query = (
            select(User)
            .where(User.created_at >= datetime.utcnow() - timedelta(hours=24))
            .order_by(User.created_at.desc())
        )
        recent_users = (await self.db.execute(recent_users_query)).scalars().all()

        # Lấy stories trong 24h gần nhất
        recent_stories_query = (
            select(Story)
            .options(joinedload(Story.categories), joinedload(Story.user))
            .where(Story.created_at >= datetime.utcnow() - timedelta(hours=24))
            .order_by(Story.created_at.desc())
        )
        recent_stories = (
            (await self.db.execute(recent_stories_query)).unique().scalars().all()
        )

        return recent_users, recent_stories
