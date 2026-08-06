import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr

from auth_utils import generate_otp, sign_jwt
from auth_middleware import get_current_user
from config import settings
from database import get_pool
from mailer import send_otp_email

router = APIRouter()


class SendOtpRequest(BaseModel):
    email: EmailStr
    mode: str
    fullName: str | None = None
    organization: str | None = None


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    token: str


class LinkedInRequest(BaseModel):
    redirectTo: str | None = None


class LinkedInExchangeRequest(BaseModel):
    code: str


class AdminDevLoginRequest(BaseModel):
    username: str
    password: str


@router.get("/me")
async def get_member_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    if not user_id or current_user.get("dev_admin") is True:
        raise HTTPException(401, "Member account required.")

    pool = await get_pool()
    user = await pool.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
    if not user:
        raise HTTPException(404, "Member account not found.")

    summary = await pool.fetchrow(
        """SELECT COUNT(DISTINCT event_slug) AS registered_sessions,
                  COUNT(DISTINCT event_slug) FILTER (WHERE attended = true) AS attended_sessions
           FROM event_rsvps
           WHERE user_id = $1 OR lower(email) = lower($2)""",
        user["id"], user["email"],
    )
    sessions = await pool.fetch(
        """SELECT event_slug, event_title, created_at, attended
           FROM event_rsvps
           WHERE user_id = $1 OR lower(email) = lower($2)
           ORDER BY created_at DESC
           LIMIT 20""",
        user["id"], user["email"],
    )

    return {
        "ok": True,
        "user": {
            "id": str(user["id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "organization": user["organization"],
            "linkedin_connected": bool(user["linkedin_id"]),
            "created_at": user["created_at"].isoformat(),
        },
        "summary": {
            "registered_sessions": summary["registered_sessions"] or 0,
            "attended_sessions": summary["attended_sessions"] or 0,
        },
        "sessions": [
            {
                "event_slug": row["event_slug"],
                "event_title": row["event_title"],
                "registered_at": row["created_at"].isoformat(),
                "attended": row["attended"],
            }
            for row in sessions
        ],
    }


def _token_hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _safe_redirect_path(value: str | None) -> str:
    if not value or not value.startswith("/") or value.startswith("//"):
        return "/"
    if "://" in value or len(value) > 500:
        return "/"
    return value


def _frontend_redirect(path: str, **params: str) -> str:
    base = f"{settings.frontend_url.rstrip('/')}{_safe_redirect_path(path)}"
    if not params:
        return base
    separator = "&" if "?" in base else "?"
    return f"{base}{separator}{urlencode(params)}"


@router.post("/admin/login")
async def admin_dev_login(body: AdminDevLoginRequest):
    if not settings.admin_dev_login_enabled:
        raise HTTPException(404, "Admin password login is not enabled.")

    username_ok = secrets.compare_digest(body.username, settings.admin_dev_username)
    password_ok = secrets.compare_digest(body.password, settings.admin_dev_password)
    if not username_ok or not password_ok:
        raise HTTPException(401, "Invalid username or password.")

    access_token = sign_jwt({
        "sub": "local-admin",
        "email": "admin@local",
        "roles": ["admin"],
        "dev_admin": True,
    })
    return {
        "ok": True,
        "session": {"access_token": access_token, "token_type": "bearer", "expires_in": 2592000},
    }


@router.post("/otp/send")
async def send_otp(body: SendOtpRequest):
    if body.mode not in ("signin", "signup"):
        raise HTTPException(400, "mode must be 'signin' or 'signup'")
    if body.mode == "signup" and (not body.fullName or not body.organization):
        raise HTTPException(400, "Full name and organization are required for sign up.")

    email = body.email.lower()
    pool = await get_pool()

    if body.mode == "signup":
        existing = await pool.fetchrow("SELECT id FROM users WHERE email = $1", email)
        if existing:
            raise HTTPException(409, "An account with this email already exists. Please sign in instead.")

    await pool.execute("DELETE FROM otp_tokens WHERE email = $1 AND used = false", email)

    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    await pool.execute(
        """INSERT INTO otp_tokens (email, token, mode, full_name, organization, expires_at)
           VALUES ($1, $2, $3, $4, $5, $6)""",
        email, otp, body.mode, body.fullName, body.organization, expires_at,
    )

    await send_otp_email(body.email, otp)
    return {"ok": True, "message": "OTP sent to your email."}


@router.post("/otp/verify")
async def verify_otp(body: VerifyOtpRequest):
    email = body.email.lower()
    pool = await get_pool()

    record = await pool.fetchrow(
        """SELECT * FROM otp_tokens
           WHERE email = $1 AND token = $2 AND used = false AND expires_at > now()
           ORDER BY created_at DESC LIMIT 1""",
        email, body.token,
    )
    if not record:
        raise HTTPException(400, "Invalid or expired OTP.")

    await pool.execute("UPDATE otp_tokens SET used = true WHERE id = $1", record["id"])

    user = await pool.fetchrow("SELECT * FROM users WHERE email = $1", email)
    if not user:
        if record["mode"] == "signin":
            raise HTTPException(400, "No account found with this email. Please sign up first.")
        user = await pool.fetchrow(
            "INSERT INTO users (email, full_name, organization) VALUES ($1, $2, $3) RETURNING *",
            email, record["full_name"], record["organization"],
        )

    roles = [r["role"] for r in await pool.fetch("SELECT role FROM user_roles WHERE user_id = $1", user["id"])]
    access_token = sign_jwt({"sub": str(user["id"]), "email": user["email"], "roles": roles})

    return {
        "ok": True,
        "session": {"access_token": access_token, "token_type": "bearer", "expires_in": 2592000},
        "user": {
            "id": str(user["id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "organization": user["organization"],
            "roles": roles,
        },
    }


@router.post("/oauth/linkedin")
async def linkedin_auth(body: LinkedInRequest = LinkedInRequest()):
    if not settings.linkedin_client_id or not settings.linkedin_client_secret or not settings.linkedin_redirect_uri:
        raise HTTPException(503, "LinkedIn OAuth is not configured.")

    state = secrets.token_urlsafe(32)
    pool = await get_pool()
    await pool.execute("DELETE FROM oauth_states WHERE expires_at <= now()")
    await pool.execute(
        "INSERT INTO oauth_states (state_hash, redirect_path, expires_at) VALUES ($1, $2, $3)",
        _token_hash(state),
        _safe_redirect_path(body.redirectTo),
        datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    params = urlencode({
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": settings.linkedin_redirect_uri,
        "state": state,
        "scope": "openid profile email",
    })
    return {"ok": True, "url": f"https://www.linkedin.com/oauth/v2/authorization?{params}"}


@router.get("/oauth/linkedin/callback")
async def linkedin_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    if not settings.linkedin_client_id or not settings.linkedin_client_secret or not settings.linkedin_redirect_uri:
        raise HTTPException(503, "LinkedIn OAuth is not configured.")
    if not state:
        raise HTTPException(400, "Missing LinkedIn OAuth state.")

    pool = await get_pool()
    state_record = await pool.fetchrow(
        """DELETE FROM oauth_states
           WHERE state_hash = $1 AND expires_at > now()
           RETURNING redirect_path""",
        _token_hash(state),
    )
    if not state_record:
        raise HTTPException(400, "Invalid or expired LinkedIn OAuth state.")

    redirect_path = state_record["redirect_path"]
    if error:
        return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="cancelled"))
    if not code:
        return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="missing_code"))

    async with httpx.AsyncClient(timeout=15.0) as client:
        token_res = await client.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.linkedin_redirect_uri,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret,
            },
        )
        if token_res.status_code >= 400:
            return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="token_exchange"))
        token_data = token_res.json()
        if "access_token" not in token_data:
            return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="token_exchange"))

        user_res = await client.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        if user_res.status_code >= 400:
            return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="profile"))
        li_user = user_res.json()

    if not li_user.get("email") or not li_user.get("sub") or li_user.get("email_verified") is False:
        return RedirectResponse(_frontend_redirect(redirect_path, linkedin_error="profile"))

    email = li_user["email"].lower()

    user = await pool.fetchrow(
        "SELECT * FROM users WHERE email = $1 OR linkedin_id = $2",
        email, li_user.get("sub"),
    )
    if not user:
        user = await pool.fetchrow(
            "INSERT INTO users (email, full_name, linkedin_id) VALUES ($1, $2, $3) RETURNING *",
            email, li_user.get("name"), li_user.get("sub"),
        )
    elif not user["linkedin_id"] and li_user.get("sub"):
        await pool.execute("UPDATE users SET linkedin_id = $1 WHERE id = $2", li_user["sub"], user["id"])

    exchange_code = secrets.token_urlsafe(32)
    await pool.execute("DELETE FROM auth_exchange_codes WHERE expires_at <= now()")
    await pool.execute(
        "INSERT INTO auth_exchange_codes (code_hash, user_id, expires_at) VALUES ($1, $2, $3)",
        _token_hash(exchange_code),
        user["id"],
        datetime.now(timezone.utc) + timedelta(minutes=2),
    )

    return RedirectResponse(_frontend_redirect(redirect_path, linkedin_code=exchange_code))


@router.post("/oauth/linkedin/exchange")
async def linkedin_exchange(body: LinkedInExchangeRequest):
    if not body.code or len(body.code) > 200:
        raise HTTPException(400, "Invalid LinkedIn exchange code.")

    pool = await get_pool()
    record = await pool.fetchrow(
        """DELETE FROM auth_exchange_codes
           WHERE code_hash = $1 AND expires_at > now()
           RETURNING user_id""",
        _token_hash(body.code),
    )
    if not record:
        raise HTTPException(400, "Invalid or expired LinkedIn exchange code.")

    user = await pool.fetchrow("SELECT * FROM users WHERE id = $1", record["user_id"])
    if not user:
        raise HTTPException(400, "LinkedIn user no longer exists.")

    roles = [r["role"] for r in await pool.fetch("SELECT role FROM user_roles WHERE user_id = $1", user["id"])]
    access_token = sign_jwt({"sub": str(user["id"]), "email": user["email"], "roles": roles})
    return {
        "ok": True,
        "session": {"access_token": access_token, "token_type": "bearer", "expires_in": 2592000},
        "user": {
            "id": str(user["id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "organization": user["organization"],
            "roles": roles,
        },
    }
