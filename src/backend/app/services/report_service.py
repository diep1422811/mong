from typing import Optional

from fastapi import HTTPException, status
from jinja2 import Environment, FileSystemLoader
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.email import send_email
from app.models.enums import ReportStatus
from app.models.report import Report
from app.models.story import Story
from app.models.user import User
from app.schemas.report_schema import ReportCreate, ReportUpdate


class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.env = Environment(loader=FileSystemLoader("app/templates"))

    async def create_report(
        self, story_id: int, report_data: ReportCreate, user_id: int
    ) -> Report:
        # Check if story exists
        story = await self._get_story(story_id)
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Story not found"
            )

        # Check if user has already reported this story
        existing_report = await self._get_existing_report(story_id, user_id)
        if existing_report:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reported this story",
            )

        # Create report
        report = Report(
            reporter_id=user_id, story_id=story_id, **report_data.model_dump()
        )

        # Increment report count
        story.report_count += 1

        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)

        # Load relationships
        await self.db.refresh(report, ["story", "reporter"])

        return report

    async def get_all_reports(
        self, skip: int = 0, limit: int = 10, status: Optional[ReportStatus] = None
    ) -> tuple[list[Report], int]:
        # Base query
        base_query = select(Report)
        count_query = select(func.count()).select_from(Report)

        # Add status filter if provided
        if status is not None:
            base_query = base_query.filter(Report.status == status)
            count_query = count_query.filter(Report.status == status)

        # Get total count
        total = await self.db.scalar(count_query)

        # Get reports with related data
        query = (
            base_query.options(
                joinedload(Report.story).joinedload(Story.categories),
                joinedload(Report.reporter),
            )
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(query)
        reports = result.unique().scalars().all()

        return reports, total

    async def get_story_reports(self, story_id: int) -> list[Report]:
        query = (
            select(Report)
            .options(
                joinedload(Report.story).joinedload(Story.categories),
                joinedload(Report.reporter),
            )
            .filter(Report.story_id == story_id)
            .order_by(Report.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def update_report(self, report_id: int, report_data: ReportUpdate) -> Report:
        report = await self._get_report(report_id)
        story = await self._get_story(report.story_id)

        # Update report fields
        for field, value in report_data.model_dump(exclude_unset=True).items():
            if field != "email_content":  # Không lưu email_content vào DB
                setattr(report, field, value)

        await self.db.commit()
        await self.db.refresh(report)

        # Nếu status được cập nhật thành RESOLVED, gửi email
        if report_data.status == ReportStatus.COMPLETED:
            await self._send_report_resolution_email(
                story=story,
                admin_note=report_data.admin_note,
                custom_content=report_data.email_content,
            )

        return report

    async def delete_report(self, report_id: int):
        report = await self._get_report(report_id)

        # Decrement report count
        story = await self._get_story(report.story_id)
        if story and story.report_count > 0:
            story.report_count -= 1

        await self.db.delete(report)
        await self.db.commit()

    async def _get_report(self, report_id: int) -> Report:
        query = (
            select(Report)
            .options(
                joinedload(Report.story).joinedload(Story.categories),
                joinedload(Report.reporter),
            )
            .filter(Report.report_id == report_id)
        )
        result = await self.db.execute(query)
        report = result.unique().scalar_one_or_none()

        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
            )
        return report

    async def _get_story(self, story_id: int) -> Optional[Story]:
        query = select(Story).filter(Story.story_id == story_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _get_existing_report(
        self, story_id: int, user_id: int
    ) -> Optional[Report]:
        query = select(Report).filter(
            Report.story_id == story_id, Report.reporter_id == user_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _send_report_resolution_email(
        self,
        story: Story,
        admin_note: Optional[str] = None,
        custom_content: Optional[str] = None,
    ):
        # Get story author's email
        author = await self._get_user(story.user_id)
        if not author or not author.email:
            return

        # Load email template
        template = self.env.get_template("report_resolution_email.html")

        # Use custom content if provided, otherwise use default template
        content = custom_content if custom_content else admin_note
        if not content:
            content = "Báo cáo về truyện của bạn đã được xử lý bởi admin."

        html_content = template.render(
            username=author.username, story_title=story.title, admin_note=content
        )

        await send_email(
            to_email=author.email,
            subject=f"Thông báo xử lý báo cáo - Truyện: {story.title}",
            html_content=html_content,
        )

    async def _get_user(self, user_id: int) -> Optional[User]:
        query = select(User).filter(User.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
