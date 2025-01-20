from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.settings import get_settings
from app.models.base import Base

load_dotenv()

settings = get_settings()

SQLALCHEMY_DATABASE_URL = (
    f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}"
    f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
)

# Create a new SQLAlchemy async engine instance without SSL
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
)

# Create a configured "AsyncSession" class
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Dependency to get a session
async def get_db():
    async with SessionLocal() as session:
        yield session
