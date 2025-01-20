from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User 
from app.core.database import get_db
from app.core.security import decode_refresh_token
from app.schemas.auth_schema import (
    OTPVerification,
    TokenResponse,
    UserCreate,
    UserLogin,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    auth_service = AuthService(db)
    return await auth_service.register(user_data)


@router.post("/login", response_model=TokenResponse)
async def login(
    user_data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    auth_service = AuthService(db)
    user, access_token, refresh_token = await auth_service.login(user_data)
    result = await db.execute(select(User).filter(User.user_id == user.user_id))
    user_info = result.scalar_one_or_none()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user_info.role  # Trả về role từ cơ sở dữ liệu
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
):
    payload = decode_refresh_token(refresh_token)
    auth_service = AuthService(db)
    new_access_token, new_refresh_token = await auth_service.refresh_token(
        int(payload["user_id"])
    )
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }

@router.post("/verify-otp", response_model=dict)
async def verify_otp(
    verification_data: OTPVerification,
    db: AsyncSession = Depends(get_db),
):
    """Verify OTP and create user account"""
    auth_service = AuthService(db)
    user = await auth_service.verify_otp(verification_data.email, verification_data.otp)
    return {"message": "Account verified successfully", "user_id": user.user_id}
