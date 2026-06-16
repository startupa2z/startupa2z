from fastapi import Depends, Header, HTTPException
from auth_utils import verify_jwt
from database import get_pool


async def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header.")
    token = authorization[len("Bearer "):]
    try:
        return verify_jwt(token)
    except Exception:
        raise HTTPException(401, "Invalid or expired token.")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(401, "Invalid token payload.")
    pool = await get_pool()
    row = await pool.fetchrow(
        "SELECT role FROM user_roles WHERE user_id = $1 AND role = 'admin'",
        user_id,
    )
    if not row:
        raise HTTPException(403, "Admin access required.")
    return user
