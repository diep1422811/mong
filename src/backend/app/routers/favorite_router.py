from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.favorite_schema import FavoriteResponse, FavoritesList
from app.services.favorite_service import FavoriteService

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.post("/stories/{story_id}", response_model=FavoriteResponse)
async def add_to_favorites(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a story to user's favorites"""
    favorite_service = FavoriteService(db)
    favorite = await favorite_service.add_favorite(story_id, current_user.user_id)
    return favorite


@router.delete("/stories/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_favorites(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a story from user's favorites"""
    favorite_service = FavoriteService(db)
    await favorite_service.remove_favorite(story_id, current_user.user_id)


@router.get("", response_model=FavoritesList)
async def get_user_favorites(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's favorite stories"""
    favorite_service = FavoriteService(db)
    favorites, total = await favorite_service.get_user_favorites(
        current_user.user_id, skip, limit
    )
    return FavoritesList(total=total, items=favorites)
