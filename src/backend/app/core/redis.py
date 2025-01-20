from typing import Optional

import aioredis

from app.core.settings import get_settings

settings = get_settings()

redis = aioredis.from_url(
    f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
    encoding="utf-8",
    decode_responses=True,
)


async def set_otp(key: str, value: str, expire: int = 300):
    """Store value in Redis with expiration time"""
    await redis.set(key, value, ex=expire)


async def get_otp(key: str) -> Optional[str]:
    """Get value from Redis"""
    return await redis.get(key)


async def delete_otp(key: str):
    """Delete value from Redis"""
    await redis.delete(key)
