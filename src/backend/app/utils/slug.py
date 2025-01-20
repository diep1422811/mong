import re
from typing import Type, TypeVar

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


async def create_unique_slug(
    db: AsyncSession, model: Type[ModelType], title: str
) -> str:
    """Create a unique slug from title"""
    # Create base slug
    slug = slugify(title)

    # Check if slug exists
    query = select(model).where(model.slug == slug)
    result = await db.execute(query)
    existing = result.scalar_one_or_none()

    if not existing:
        return slug

    # If exists, add number suffix
    counter = 1
    while True:
        new_slug = f"{slug}-{counter}"
        query = select(model).where(model.slug == new_slug)
        result = await db.execute(query)
        existing = result.scalar_one_or_none()

        if not existing:
            return new_slug
        counter += 1
