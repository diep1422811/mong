from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, verify_admin
from app.models.enums import ReportStatus
from app.models.user import User
from app.schemas.report_schema import (
    ReportCreate,
    ReportList,
    ReportResponse,
    ReportUpdate,
)
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


# User endpoints
@router.post("/stories/{story_id}", response_model=ReportResponse)
async def create_report(
    story_id: int,
    report_data: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new report for a story"""
    report_service = ReportService(db)
    report = await report_service.create_report(
        story_id, report_data, current_user.user_id
    )
    return report

# Admin endpoints
@router.get("", response_model=ReportList, dependencies=[Depends(verify_admin)])
async def get_all_reports(
    skip: int = 0,
    limit: int = 10,
    status: Optional[ReportStatus] = None,
    db: AsyncSession = Depends(get_db),
):
    """Get all reports (Admin only)"""
    report_service = ReportService(db)
    reports, total = await report_service.get_all_reports(skip, limit, status)
    return ReportList(total=total, items=reports)


@router.get(
    "/stories/{story_id}",
    response_model=list[ReportResponse],
    dependencies=[Depends(verify_admin)],
)
async def get_story_reports(
    story_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get all reports for a specific story (Admin only)"""
    report_service = ReportService(db)
    reports = await report_service.get_story_reports(story_id)
    return reports


@router.patch(
    "/{report_id}", response_model=ReportResponse, dependencies=[Depends(verify_admin)]
)
async def update_report(
    report_id: int,
    report_data: ReportUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update report status (Admin only)"""
    report_service = ReportService(db)
    report = await report_service.update_report(report_id, report_data)
    return report


@router.delete(
    "/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_admin)],
)
async def delete_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a report (Admin only)"""
    report_service = ReportService(db)
    await report_service.delete_report(report_id)
