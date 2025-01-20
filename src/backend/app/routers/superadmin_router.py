from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import verify_superadmin
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user_schema import AdminUserList, UserResponse, UserRoleUpdate
from app.services.superadmin_service import SuperAdminService

router = APIRouter(
    prefix="/superadmin", tags=["SuperAdmin"]
)


@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update user role (SuperAdmin only)"""
    superadmin_service = SuperAdminService(db)
    user = await superadmin_service.update_user_role(user_id, role_update.role)
    return user


@router.get("/system/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(verify_superadmin)
):
    """Get system statistics (SuperAdmin only)"""
    superadmin_service = SuperAdminService(db)
    stats = await superadmin_service.get_system_stats()
    return stats


@router.post("/system/backup")
async def create_system_backup(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(verify_superadmin)
):
    """Create system backup (SuperAdmin only)"""
    superadmin_service = SuperAdminService(db)
    backup_info = await superadmin_service.create_backup()
    return backup_info


@router.get("/users", response_model=AdminUserList)
async def get_all_users(
    skip: int = 0,
    limit: int = 10,
    role: Optional[UserRole] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(verify_superadmin),
):
    """Get all users with optional role filter (SuperAdmin only)"""
    superadmin_service = SuperAdminService(db)
    users, total = await superadmin_service.get_all_users(skip, limit, role)
    return AdminUserList(users=users, total=total, skip=skip, limit=limit)
