from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from asyncpg import UniqueViolationError
from database import get_pool
from auth_middleware import get_current_user
from member_profile import fetch_member_profile, is_member_profile_complete

router = APIRouter()


class RsvpRequest(BaseModel):
    event_id: str | None = None
    event_slug: str
    event_title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    role: str
    pitch_interest: bool = False
    whatsapp_opt_in: bool = False
    notes: str | None = None


class MemberRsvpRequest(BaseModel):
    event_id: str | None = None
    event_slug: str
    event_title: str


@router.post("", status_code=201)
async def submit_rsvp(body: RsvpRequest):
    pool = await get_pool()
    try:
        await pool.execute(
            """INSERT INTO event_rsvps
                 (event_id, event_slug, event_title, first_name, last_name,
                  email, phone, company, role, pitch_interest, whatsapp_opt_in, notes)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)""",
            body.event_id, body.event_slug, body.event_title,
            body.first_name, body.last_name, str(body.email),
            body.phone, body.company, body.role, body.pitch_interest,
            body.whatsapp_opt_in, body.notes,
        )
    except UniqueViolationError:
        raise HTTPException(409, "You've already RSVP'd to this event with this email address.")
    return {"ok": True, "message": "RSVP confirmed."}


@router.post("/member", status_code=201)
async def submit_member_rsvp(body: MemberRsvpRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    if not user_id or current_user.get("dev_admin") is True:
        raise HTTPException(401, "Member account required.")

    pool = await get_pool()
    user = await fetch_member_profile(pool, user_id)
    if not user:
        raise HTTPException(404, "Member account not found.")
    if not is_member_profile_complete(user):
        raise HTTPException(428, "Complete your member profile before registering for an event.")

    full_name = (user["full_name"] or user["email"].split("@")[0]).strip()
    first_name, _, last_name = full_name.partition(" ")
    try:
        await pool.execute(
            """INSERT INTO event_rsvps
                 (user_id, event_id, event_slug, event_title, first_name, last_name,
                  email, company, role, pitch_interest, whatsapp_opt_in)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'member', false, false)""",
            user["id"], body.event_id, body.event_slug, body.event_title,
            first_name, last_name or "—", user["email"], user["company"],
        )
    except UniqueViolationError:
        raise HTTPException(409, "You are already registered for this event.")

    return {"ok": True, "message": "RSVP confirmed."}
