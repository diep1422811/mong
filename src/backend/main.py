from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.exception_handler import (
    http_exception_handler,
    validation_exception_handler,
)
from app.core.logging import setup_logging
from app.core.settings import get_settings
from app.routers import (
    admin_router,
    auth_router,
    category_router,
    chapter_router,
    comment_router,
    dashboard_router,
    favorite_router,
    reading_progress_router,
    report_router,
    review_router,
    story_router,
    superadmin_router,
    user_router,
)

# Setup logging
setup_logging()

# Get settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(Exception, http_exception_handler)
app.add_exception_handler(ValueError, validation_exception_handler)

# Add routers
app.include_router(auth_router.router, prefix=settings.API_PREFIX)
app.include_router(user_router.router, prefix=settings.API_PREFIX)
app.include_router(admin_router.router, prefix=settings.API_PREFIX)
app.include_router(superadmin_router.router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router.router, prefix=settings.API_PREFIX)
app.include_router(story_router.router, prefix=settings.API_PREFIX)
app.include_router(chapter_router.router, prefix=settings.API_PREFIX)
app.include_router(category_router.router, prefix=settings.API_PREFIX)
app.include_router(reading_progress_router.router, prefix=settings.API_PREFIX)
app.include_router(review_router.router, prefix=settings.API_PREFIX)
app.include_router(comment_router.router, prefix=settings.API_PREFIX)
app.include_router(favorite_router.router, prefix=settings.API_PREFIX)
app.include_router(report_router.router, prefix=settings.API_PREFIX)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Story API",
        "version": settings.VERSION,
        "docs": "/docs",
    }
