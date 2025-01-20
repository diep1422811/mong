import json
import random
import string
from datetime import datetime, timezone
from typing import Tuple

from fastapi import HTTPException, status
from jinja2 import Environment, FileSystemLoader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.email import send_email
from app.core.redis import delete_otp, get_otp, set_otp
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.auth_schema import UserCreate, UserLogin


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        # Khởi tạo Environment cho Jinja2
        self.env = Environment(loader=FileSystemLoader("app/templates"))

    def generate_otp(self) -> str:
        return "".join(random.choices(string.digits, k=6))

    async def register(self, user_data: UserCreate) -> dict:
        # Check if email exists
        query = select(User).where(User.email == user_data.email)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Check if username exists
        query = select(User).where(User.username == user_data.username)
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

        # Generate OTP
        otp = self.generate_otp()

        # Store user data and OTP in Redis
        user_data_dict = {
            "email": user_data.email,
            "username": user_data.username,
            "password_hash": get_password_hash(user_data.password),
        }

        # Store user registration data for 10 minutes
        await set_otp(
            f"register:{user_data.email}", json.dumps(user_data_dict), expire=600
        )
        # Store OTP for 5 minutes
        await set_otp(f"otp:{user_data.email}", otp, expire=300)

        # Send OTP email
        await self.send_otp_email(user_data.email, user_data.username, otp)

        return {"message": "Please check your email for OTP verification"}

    async def verify_otp(self, email: str, otp: str) -> User:
        # Get stored OTP
        stored_otp = await get_otp(f"otp:{email}")
        if not stored_otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired or is invalid",
            )

        if stored_otp != otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP"
            )

        # Get stored user data
        user_data_str = await get_otp(f"register:{email}")
        if not user_data_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration session expired",
            )

        # Create user in database
        try:
            user_data = json.loads(user_data_str)
            user = User(**user_data)
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            # Clean up Redis
            await delete_otp(f"otp:{email}")
            await delete_otp(f"register:{email}")

            return user

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}",
            )

    async def send_otp_email(self, email: str, username: str, otp: str):
        template = self.env.get_template("otp_email.html")
        html_content = template.render(username=username, otp=otp)

        await send_email(
            to_email=email,
            subject="Xác thực tài khoản của bạn",
            html_content=html_content,
        )

    async def login(self, login_data: UserLogin) -> Tuple[User, str, str]:
        """
        Authenticate user and return user object with access and refresh tokens
        """
        # Find user by email
        query = select(User).where(User.email == login_data.email)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        # Verify user exists and password is correct
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Update last login timestamp
        user.last_login = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        access_token = create_access_token(user.user_id)
        refresh_token = create_refresh_token(user.user_id)

        return user, access_token, refresh_token
