import base64
import json
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr

from auth_utils import generate_otp, sign_jwt
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
    if not settings.linkedin_client_id or not settings.linkedin_redirect_uri:
        raise HTTPException(503, "LinkedIn OAuth is not configured.")

    state = base64.b64encode(json.dumps({"redirectTo": body.redirectTo or ""}).encode()).decode()
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
    if error:
        raise HTTPException(400, f"LinkedIn auth error: {error}")
    if not code:
        raise HTTPException(400, "Missing authorization code.")
    if not settings.linkedin_client_id or not settings.linkedin_client_secret or not settings.linkedin_redirect_uri:
        raise HTTPException(503, "LinkedIn OAuth is not configured.")

    async with httpx.AsyncClient() as client:
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
        token_data = token_res.json()
        if "access_token" not in token_data:
            raise HTTPException(400, "Failed to exchange LinkedIn code for token.")

        user_res = await client.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        li_user = user_res.json()

    if not li_user.get("email"):
        raise HTTPException(400, "Could not retrieve email from LinkedIn profile.")

    email = li_user["email"].lower()
    pool = await get_pool()

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

    roles = [r["role"] for r in await pool.fetch("SELECT role FROM user_roles WHERE user_id = $1", user["id"])]
    access_token = sign_jwt({"sub": str(user["id"]), "email": user["email"], "roles": roles})

    redirect_to = "/"
    try:
        redirect_to = json.loads(base64.b64decode(state or "").decode()).get("redirectTo") or "/"
    except Exception:
        pass

    base = redirect_to if redirect_to.startswith("http") else f"http://localhost:5173{redirect_to}"
    sep = "&" if "?" in base else "?"
    return RedirectResponse(f"{base}{sep}access_token={access_token}")
