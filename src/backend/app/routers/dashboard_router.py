from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import verify_admin
from app.schemas.dashboard_schema import DashboardRecentData, DashboardStats, ChartDataResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard", tags=["Dashboard"], dependencies=[Depends(verify_admin)]
)

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    period: str = Query("24h", regex="^(24h|week|month)$"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Get dashboard statistics
    - period: 24h, week, month
    - start_date & end_date: Optional exact date range
    """
    dashboard_service = DashboardService(db)
    stats = await dashboard_service.get_dashboard_stats(period, start_date, end_date)
    return stats


@router.get("/recent", response_model=DashboardRecentData)
async def get_recent_data(db: AsyncSession = Depends(get_db)):
    """Get recent users and stories (last 24 hours)"""
    dashboard_service = DashboardService(db)
    recent_users, recent_stories = await dashboard_service.get_recent_data()
    return DashboardRecentData(recent_users=recent_users, recent_stories=recent_stories)

@router.get("/chart-data", response_model=ChartDataResponse)
async def get_chart_data(
    period: str = Query("24h", regex="^(24h|week|month)$"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    API trả về dữ liệu chart
    - period: 24h, week, month
    - start_date & end_date: khoảng thời gian tùy chỉnh (tùy chọn)
    """
    dashboard_service = DashboardService(db)
    chart_data = await dashboard_service.get_chart_data(period, start_date, end_date)
    return chart_data
