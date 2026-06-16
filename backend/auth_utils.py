import secrets
from datetime import datetime, timedelta, timezone
from jose import jwt
from config import settings


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)


def sign_jwt(payload: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    return jwt.encode({**payload, "exp": expire}, settings.jwt_secret, algorithm="HS256")


def verify_jwt(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
