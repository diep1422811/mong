from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import verify_superadmin
from app.schemas.category_schema import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    category_service = CategoryService(db)
    return await category_service.create_category(category_data)


@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    category_service = CategoryService(db)
    return await category_service.get_categories(skip, limit)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    category_service = CategoryService(db)
    return await category_service.get_category(category_id)


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
    dependencies=[Depends(verify_superadmin)],
)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
):
    category_service = CategoryService(db)
    return await category_service.update_category(category_id, category_data)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_superadmin)],
)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    category_service = CategoryService(db)
    await category_service.delete_category(category_id)


@router.post(
    "/seed",
    response_model=list[CategoryResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_superadmin)],
)
async def seed_categories(
    db: AsyncSession = Depends(get_db),
):
    """Seed initial categories (Super Admin only)"""
    category_service = CategoryService(db)
    return await category_service.seed_categories()
