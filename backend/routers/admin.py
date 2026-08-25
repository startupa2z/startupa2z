import json
import os
import re
import uuid
from datetime import datetime, timezone
from typing import Literal

from asyncpg import UniqueViolationError
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator, model_validator

from auth_middleware import require_admin
from database import get_pool
from member_profile import fetch_member_profile
from all_users import upsert_all_user

router = APIRouter()

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

ChannelName = Literal["website", "luma", "eventbrite", "linkedin", "x"]
ChannelStatus = Literal["draft", "ready", "scheduled", "published", "failed", "not_connected"]
ContentType = Literal["announcement", "reminder", "follow_up"]
ContentStatus = Literal["draft", "in_review", "approved", "scheduled", "published"]


def _slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    return re.sub(r"-+", "-", s)[:80]


def _created_by(user: dict) -> uuid.UUID | None:
    try:
        return uuid.UUID(str(user.get("sub")))
    except (TypeError, ValueError, AttributeError):
        return None


# ——— Submissions ——————————————————————————————————————————————————————————————

@router.get("/submissions")
async def list_submissions(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    return {"ok": True, "data": [dict(r) for r in rows]}


# ——— Sponsorship payments ——————————————————————————————————————————————————

class SponsorFulfillmentPayload(BaseModel):
    status: Literal["pending", "contacted", "fulfilled"]


@router.get("/sponsor-payments")
async def list_sponsor_payments(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT id, stripe_session_id, stripe_payment_intent_id,
                  payment_status, fulfillment_status, amount_total, amount_refunded,
                  currency, customer_email, customer_name, package_id, package_name,
                  livemode, paid_at, fulfilled_at, created_at, updated_at
             FROM sponsor_payments
            ORDER BY created_at DESC"""
    )
    return {"ok": True, "data": [dict(row) for row in rows]}


@router.patch("/sponsor-payments/{payment_id}/fulfillment")
async def update_sponsor_fulfillment(
    payment_id: str,
    body: SponsorFulfillmentPayload,
    user: dict = Depends(require_admin),
):
    pool = await get_pool()
    row = await pool.fetchrow(
        """UPDATE sponsor_payments
              SET fulfillment_status = $1,
                  fulfilled_at = CASE WHEN $1 = 'fulfilled' THEN now() ELSE NULL END,
                  updated_at = now()
            WHERE id = $2
        RETURNING id, stripe_session_id, stripe_payment_intent_id,
                  payment_status, fulfillment_status, amount_total, amount_refunded,
                  currency, customer_email, customer_name, package_id, package_name,
                  livemode, paid_at, fulfilled_at, created_at, updated_at""",
        body.status,
        payment_id,
    )
    if not row:
        raise HTTPException(404, "Sponsorship payment not found.")
    return {"ok": True, "data": dict(row)}


# ——— Members ————————————————————————————————————————————————————————————————

@router.get("/members")
async def list_members(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT u.*, p.full_name, p.company, p.job_title, p.founder_status,
                  (SELECT COUNT(DISTINCT r.event_slug)
                     FROM event_rsvps r
                    WHERE r.user_id = u.id OR lower(r.email) = lower(u.email)) AS registered_sessions,
                  (SELECT COUNT(DISTINCT r.event_slug)
                     FROM event_rsvps r
                    WHERE (r.user_id = u.id OR lower(r.email) = lower(u.email))
                      AND r.attended = true) AS attended_sessions
             FROM users u
        LEFT JOIN member_profiles p ON p.user_id = u.id
             ORDER BY u.created_at DESC"""
    )
    return {"ok": True, "data": [dict(row) for row in rows]}


@router.get("/members/{member_id}/sessions")
async def list_member_sessions(member_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    member = await pool.fetchrow("SELECT id, email FROM users WHERE id = $1", member_id)
    if not member:
        raise HTTPException(404, "Member not found.")
    rows = await pool.fetch(
        """SELECT id, event_slug, event_title, created_at, attended
             FROM event_rsvps
            WHERE user_id = $1 OR lower(email) = lower($2)
            ORDER BY created_at DESC""",
        member["id"], member["email"],
    )
    return {"ok": True, "data": [dict(row) for row in rows]}


class MemberUpdatePayload(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = Field(default=None, max_length=120)
    company: str | None = Field(default=None, max_length=160)
    job_title: str | None = Field(default=None, max_length=120)
    founder_status: Literal["founder", "co_founder", "aspiring_founder", "not_founder"] | None = None

    @field_validator("full_name", "company", "job_title")
    @classmethod
    def trim_optional_member_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None


@router.put("/members/{member_id}")
async def update_member(member_id: str, body: MemberUpdatePayload, user: dict = Depends(require_admin)):
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(400, "No fields to update.")

    pool = await get_pool()
    original_email = await pool.fetchval("SELECT email FROM users WHERE id = $1", member_id)
    if not original_email:
        raise HTTPException(404, "Member not found.")
    try:
        if "email" in updates:
            if updates["email"] is None:
                raise HTTPException(400, "Email cannot be empty.")
            await pool.execute(
                "UPDATE users SET email = $1, updated_at = now() WHERE id = $2",
                str(updates.pop("email")).lower(), member_id,
            )
    except UniqueViolationError:
        raise HTTPException(409, "A member with this email already exists.")

    profile_updates = {
        field: updates[field]
        for field in ("full_name", "company", "job_title", "founder_status")
        if field in updates
    }
    if profile_updates:
        await pool.execute(
            "INSERT INTO member_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
            member_id,
        )
        values = list(profile_updates.values())
        sets = [f"{field} = ${index}" for index, field in enumerate(profile_updates, start=1)]
        values.append(member_id)
        await pool.execute(
            f"UPDATE member_profiles SET {', '.join(sets)}, updated_at = now() WHERE user_id = ${len(values)}",
            *values,
        )

    row = await fetch_member_profile(pool, member_id)
    if original_email.strip().lower() != row["email"].strip().lower():
        await pool.execute(
            """UPDATE all_users
                  SET member_user_id = NULL, is_member = false, updated_at = now()
                WHERE normalized_email = $1""",
            original_email.strip().lower(),
        )
    await upsert_all_user(
        pool,
        email=row["email"],
        source="member",
        full_name=row["full_name"],
        company=row["company"],
        job_title=row["job_title"],
        member_user_id=row["id"],
    )

    registered_sessions = await pool.fetchval(
        "SELECT COUNT(DISTINCT event_slug) FROM event_rsvps WHERE user_id = $1 OR lower(email) = lower($2)",
        row["id"], row["email"],
    )
    attended_sessions = await pool.fetchval(
        """SELECT COUNT(DISTINCT event_slug) FROM event_rsvps
             WHERE (user_id = $1 OR lower(email) = lower($2)) AND attended = true""",
        row["id"], row["email"],
    )
    return {"ok": True, "data": {**dict(row), "registered_sessions": registered_sessions or 0, "attended_sessions": attended_sessions or 0}}


@router.delete("/members/{member_id}")
async def delete_member(member_id: str, user: dict = Depends(require_admin)):
    if str(user.get("sub")) == member_id:
        raise HTTPException(400, "You cannot delete your own admin account.")
    pool = await get_pool()
    member_email = await pool.fetchval("SELECT email FROM users WHERE id = $1", member_id)
    result = await pool.execute("DELETE FROM users WHERE id = $1", member_id)
    if result == "DELETE 0":
        raise HTTPException(404, "Member not found.")
    if member_email:
        await pool.execute(
            """UPDATE all_users
                  SET is_member = false, member_user_id = NULL, updated_at = now()
                WHERE normalized_email = $1""",
            member_email.strip().lower(),
        )
    return {"ok": True}


# ——— Businesses ——————————————————————————————————————————————————————————————

@router.get("/businesses")
async def list_businesses(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM businesses ORDER BY created_at DESC")
    data = []
    for row in rows:
        business = dict(row)
        if isinstance(business.get("channels"), str):
            business["channels"] = json.loads(business["channels"])
        business["founders"] = [dict(item) for item in await pool.fetch(
            "SELECT * FROM business_founders WHERE business_id = $1 ORDER BY display_order, created_at",
            row["id"],
        )]
        business["media"] = [dict(item) for item in await pool.fetch(
            "SELECT * FROM business_media WHERE business_id = $1 ORDER BY display_order, created_at",
            row["id"],
        )]
        data.append(business)
    return {"ok": True, "data": data}


class AdminBusinessMediaPayload(BaseModel):
    media_type: Literal["image", "video"]
    url: str = Field(min_length=1, max_length=500)
    caption: str | None = Field(default=None, max_length=200)

    @field_validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        cleaned = value.strip()
        if not (cleaned.startswith("https://") or cleaned.startswith("http://") or cleaned.startswith("/static/")):
            raise ValueError("Use a complete media URL or an uploaded image.")
        return cleaned

    @field_validator("caption")
    @classmethod
    def trim_caption(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None


class AdminBusinessFounderPayload(BaseModel):
    id: uuid.UUID
    name: str = Field(min_length=2, max_length=100)
    role: str = Field(min_length=2, max_length=50)
    linkedin_url: HttpUrl | None = None
    journey: str | None = Field(default=None, max_length=2000)
    photo_url: str | None = Field(default=None, max_length=500)
    directory_visible: bool = True

    @field_validator("name", "role")
    @classmethod
    def trim_founder_name(cls, value: str) -> str:
        return value.strip()

    @field_validator("journey")
    @classmethod
    def trim_founder_journey(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None

    @field_validator("photo_url")
    @classmethod
    def validate_photo_url(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        if not cleaned:
            return None
        if not (cleaned.startswith("https://") or cleaned.startswith("http://") or cleaned.startswith("/static/")):
            raise ValueError("Use a complete photo URL or an uploaded image.")
        return cleaned


class AdminBusinessChannelPayload(BaseModel):
    label: str = Field(min_length=1, max_length=40)
    url: HttpUrl

    @field_validator("label")
    @classmethod
    def trim_label(cls, value: str) -> str:
        return value.strip()


class BusinessUpdatePayload(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    pitch: str | None = Field(default=None, min_length=20, max_length=280)
    stage: str | None = Field(default=None, min_length=2, max_length=50)
    location: str | None = Field(default=None, min_length=2, max_length=120)
    category: str | None = Field(default=None, min_length=2, max_length=50)
    tags: list[str] | None = Field(default=None, max_length=5)
    website_url: HttpUrl | None = None
    clear_website_url: bool = False
    logo_url: str | None = Field(default=None, max_length=500)
    journey: str | None = Field(default=None, max_length=4000)
    challenges: str | None = Field(default=None, max_length=3000)
    challenge_solution: str | None = Field(default=None, max_length=3000)
    ask_text: str | None = Field(default=None, max_length=3000)
    offer_text: str | None = Field(default=None, max_length=3000)
    founded_year: int | None = Field(default=None, ge=1800, le=2200)
    team_size: int | None = Field(default=None, ge=1, le=100000)
    company_status: str | None = Field(default=None, max_length=50)
    channels: list[AdminBusinessChannelPayload] | None = Field(default=None, max_length=8)
    contact_name: str | None = Field(default=None, min_length=2, max_length=100)
    contact_email: EmailStr | None = None
    published: bool | None = None
    media: list[AdminBusinessMediaPayload] | None = Field(default=None, max_length=6)
    founders: list[AdminBusinessFounderPayload] | None = Field(default=None, max_length=5)

    @field_validator("name", "pitch", "stage", "location", "category", "contact_name", "journey", "challenges", "challenge_solution", "company_status")
    @classmethod
    def trim_text(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None

    @field_validator("ask_text", "offer_text", mode="before")
    @classmethod
    def normalize_points(cls, value: str | None) -> str | None:
        if value is None:
            return None
        points = [re.sub(r"^\s*(?:[-*•]|\d+[.)])\s*", "", line).strip() for line in value.splitlines()]
        points = [point for point in points if point]
        if len(points) > 3:
            raise ValueError("Use no more than 3 points.")
        if any(len(point) > 120 for point in points):
            raise ValueError("Keep each point to 120 characters or fewer.")
        return "\n".join(points) or None

    @field_validator("tags")
    @classmethod
    def clean_tags(cls, values: list[str] | None) -> list[str] | None:
        if values is None:
            return None
        cleaned: list[str] = []
        for value in values:
            tag = value.strip()
            if not tag or tag in cleaned:
                continue
            if len(tag) > 30:
                raise ValueError("Each tag must be 30 characters or fewer.")
            cleaned.append(tag)
        return cleaned

    @model_validator(mode="after")
    def validate_media_counts(self):
        if self.media is None:
            return self
        if sum(item.media_type == "image" for item in self.media) > 3:
            raise ValueError("A profile can contain up to 3 photos.")
        if sum(item.media_type == "video" for item in self.media) > 3:
            raise ValueError("A profile can contain up to 3 videos.")
        return self
@router.put("/businesses/{business_id}")
async def update_business(
    business_id: str,
    body: BusinessUpdatePayload,
    user: dict = Depends(require_admin),
):
    pool = await get_pool()
    sets: list[str] = []
    values: list = []

    for field in ("name", "pitch", "stage", "location", "category", "tags", "contact_name", "logo_url", "journey", "challenges", "challenge_solution", "ask_text", "offer_text", "founded_year", "team_size", "company_status", "channels", "published"):
        value = getattr(body, field)
        if value is not None:
            if field == "channels":
                value = json.dumps([item.model_dump(mode="json") for item in value])
            values.append(value)
            sets.append(f"{field} = ${len(values)}::jsonb" if field == "channels" else f"{field} = ${len(values)}")

    if body.published is not None:
        values.append("published" if body.published else "hidden")
        sets.append(f"status = ${len(values)}")

    if body.contact_email is not None:
        values.append(str(body.contact_email))
        sets.append(f"contact_email = ${len(values)}")

    if body.clear_website_url:
        sets.append("website_url = NULL")
    elif body.website_url is not None:
        values.append(str(body.website_url))
        sets.append(f"website_url = ${len(values)}")

    if not sets and body.media is None and body.founders is None:
        raise HTTPException(400, "No fields to update.")

    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                if sets:
                    values.append(business_id)
                    row = await connection.fetchrow(
                        f"UPDATE businesses SET {', '.join(sets)} WHERE id = ${len(values)} RETURNING *",
                        *values,
                    )
                else:
                    row = await connection.fetchrow("SELECT * FROM businesses WHERE id = $1", business_id)
                if not row:
                    raise HTTPException(404, "Business not found.")
                if body.media is not None:
                    await connection.execute("DELETE FROM business_media WHERE business_id = $1", row["id"])
                    for index, media_item in enumerate(body.media):
                        await connection.execute(
                            """INSERT INTO business_media
                                   (business_id, media_type, url, caption, display_order)
                                 VALUES ($1, $2, $3, $4, $5)""",
                            row["id"], media_item.media_type, media_item.url, media_item.caption, index,
                        )
                if body.founders is not None:
                    founder_ids = [founder.id for founder in body.founders]
                    owned_founder_ids = {item["id"] for item in await connection.fetch(
                        "SELECT id FROM business_founders WHERE business_id = $1 AND id = ANY($2::uuid[])",
                        row["id"], founder_ids,
                    )}
                    if len(owned_founder_ids) != len(founder_ids):
                        raise HTTPException(400, "One or more founders do not belong to this business.")
                    for index, founder in enumerate(body.founders):
                        await connection.execute(
                            """UPDATE business_founders
                                  SET name = $1, role = $2, linkedin_url = $3, journey = $4,
                                      photo_url = $5, directory_visible = $6, display_order = $7
                                WHERE id = $8 AND business_id = $9""",
                            founder.name, founder.role,
                            str(founder.linkedin_url) if founder.linkedin_url else None,
                            founder.journey, founder.photo_url, founder.directory_visible, index,
                            founder.id, row["id"],
                        )
    except UniqueViolationError:
        raise HTTPException(409, "A business with this name is already listed.")

    data = dict(row)
    if isinstance(data.get("channels"), str):
        data["channels"] = json.loads(data["channels"])
    data["founders"] = [dict(item) for item in await pool.fetch(
        "SELECT * FROM business_founders WHERE business_id = $1 ORDER BY display_order, created_at",
        row["id"],
    )]
    data["media"] = [dict(item) for item in await pool.fetch(
        "SELECT * FROM business_media WHERE business_id = $1 ORDER BY display_order, created_at",
        row["id"],
    )]
    return {"ok": True, "data": data}


@router.delete("/businesses/{business_id}")
async def delete_business(business_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    result = await pool.execute("DELETE FROM businesses WHERE id = $1", business_id)
    if result == "DELETE 0":
        raise HTTPException(404, "Business not found.")
    return {"ok": True}


# ——— RSVPs ————————————————————————————————————————————————————————————————————

@router.get("/rsvps")
async def list_rsvps(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM event_rsvps ORDER BY created_at DESC")
    return {"ok": True, "data": [dict(r) for r in rows]}


class AttendancePayload(BaseModel):
    attended: bool


@router.patch("/rsvps/{rsvp_id}/attendance")
async def update_rsvp_attendance(rsvp_id: str, body: AttendancePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    row = await pool.fetchrow(
        "UPDATE event_rsvps SET attended = $1 WHERE id = $2 RETURNING *",
        body.attended,
        rsvp_id,
    )
    if not row:
        raise HTTPException(404, "RSVP not found.")
    return {"ok": True, "data": dict(row)}


@router.delete("/rsvps/{rsvp_id}")
async def delete_rsvp(rsvp_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    await pool.execute("DELETE FROM event_rsvps WHERE id = $1", rsvp_id)
    return {"ok": True}


# ——— Events ———————————————————————————————————————————————————————————————————

@router.get("/events/{event_id}")
async def get_event_by_id(event_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT * FROM events WHERE id = $1", event_id)
    if not row:
        raise HTTPException(404, "Event not found.")
    data = dict(row)
    for field in ("agenda", "speakers"):
        if isinstance(data.get(field), str):
            data[field] = json.loads(data[field])
    return {"ok": True, "data": data}


class EventCreatePayload(BaseModel):
    title: str
    date: str
    time: str
    venue: str
    address: str | None = None
    type: str
    description: str | None = None
    long_description: str | None = None
    spots: int = 0
    capacity: int = 0
    price: str = "Free"
    featured: bool = False
    agenda: list | None = None
    speakers: list | None = None
    image_url: str | None = None


@router.post("/events")
async def create_event(body: EventCreatePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    event_id = str(uuid.uuid4())
    slug = _slugify(body.title) + "-" + event_id[:4]
    await pool.execute(
        """INSERT INTO events
             (id, slug, title, date, time, venue, address, type, description,
              long_description, spots, capacity, price, featured, agenda, speakers,
              image_url, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18)""",
        event_id, slug, body.title, body.date, body.time, body.venue, body.address,
        body.type, body.description, body.long_description, body.spots, body.capacity,
        body.price, body.featured,
        json.dumps(body.agenda or []), json.dumps(body.speakers or []),
        body.image_url, _created_by(user),
    )
    await pool.execute(
        """INSERT INTO event_channels (event_id, channel, status, external_url, published_at)
           VALUES ($1, 'website', 'published', $2, now()), ($1, 'luma', 'draft', NULL, NULL)
           ON CONFLICT (event_id, channel) DO NOTHING""",
        event_id, f"/events/{slug}",
    )
    return {"ok": True, "id": event_id, "slug": slug}


class EventUpdatePayload(BaseModel):
    title: str | None = None
    date: str | None = None
    time: str | None = None
    venue: str | None = None
    address: str | None = None
    type: str | None = None
    description: str | None = None
    long_description: str | None = None
    spots: int | None = None
    capacity: int | None = None
    price: str | None = None
    featured: bool | None = None
    agenda: list | None = None
    speakers: list | None = None
    image_url: str | None = None
    remove_image: bool = False


@router.put("/events/{event_id}")
async def update_event(event_id: str, body: EventUpdatePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    sets: list[str] = []
    vals: list = []
    i = 1

    for field in ("title", "date", "time", "venue", "address", "type",
                  "description", "long_description", "spots", "capacity",
                  "price", "featured"):
        val = getattr(body, field)
        if val is not None:
            sets.append(f"{field} = ${i}")
            vals.append(val)
            i += 1

    if body.agenda is not None:
        sets.append(f"agenda = ${i}::jsonb")
        vals.append(json.dumps(body.agenda))
        i += 1

    if body.speakers is not None:
        sets.append(f"speakers = ${i}::jsonb")
        vals.append(json.dumps(body.speakers))
        i += 1

    if body.remove_image:
        sets.append("image_url = NULL")
    elif body.image_url is not None:
        sets.append(f"image_url = ${i}")
        vals.append(body.image_url)
        i += 1

    if not sets:
        raise HTTPException(400, "No fields to update.")

    sets.append(f"updated_at = now()")
    vals.append(event_id)
    await pool.execute(
        f"UPDATE events SET {', '.join(sets)} WHERE id = ${i}",
        *vals,
    )
    return {"ok": True}


@router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    await pool.execute("DELETE FROM events WHERE id = $1", event_id)
    return {"ok": True}


# ——— Publishing workflow ————————————————————————————————————————————————————

class ChannelUpdatePayload(BaseModel):
    channel: ChannelName
    status: ChannelStatus = "draft"
    external_url: str | None = None
    external_event_id: str | None = None
    scheduled_at: datetime | None = None
    last_error: str | None = None


class ContentCreatePayload(BaseModel):
    event_id: str
    channel: ChannelName
    content_type: ContentType = "announcement"
    title: str = ""
    body: str
    status: ContentStatus = "draft"
    scheduled_at: datetime | None = None


class ContentUpdatePayload(BaseModel):
    channel: ChannelName | None = None
    content_type: ContentType | None = None
    title: str | None = None
    body: str | None = None
    status: ContentStatus | None = None
    scheduled_at: datetime | None = None
    clear_schedule: bool = False


class GenerateContentPayload(BaseModel):
    channel: ChannelName
    content_type: ContentType = "announcement"


@router.get("/events/{event_id}/publishing")
async def get_event_publishing(event_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    event = await pool.fetchrow("SELECT * FROM events WHERE id = $1", event_id)
    if not event:
        raise HTTPException(404, "Event not found.")
    channels = await pool.fetch(
        "SELECT * FROM event_channels WHERE event_id = $1 ORDER BY channel", event_id,
    )
    content = await pool.fetch(
        """SELECT * FROM event_content_items
           WHERE event_id = $1
           ORDER BY COALESCE(scheduled_at, created_at), created_at DESC""",
        event_id,
    )
    return {
        "ok": True,
        "data": {
            "event": dict(event),
            "channels": [dict(row) for row in channels],
            "content": [dict(row) for row in content],
        },
    }


@router.put("/events/{event_id}/channels")
async def upsert_event_channel(
    event_id: str,
    body: ChannelUpdatePayload,
    user: dict = Depends(require_admin),
):
    pool = await get_pool()
    if not await pool.fetchval("SELECT 1 FROM events WHERE id = $1", event_id):
        raise HTTPException(404, "Event not found.")
    published_at = datetime.now(timezone.utc) if body.status == "published" else None
    row = await pool.fetchrow(
        """INSERT INTO event_channels
             (event_id, channel, status, external_url, external_event_id, scheduled_at, published_at, last_error)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (event_id, channel) DO UPDATE SET
             status = EXCLUDED.status,
             external_url = EXCLUDED.external_url,
             external_event_id = EXCLUDED.external_event_id,
             scheduled_at = EXCLUDED.scheduled_at,
             published_at = COALESCE(EXCLUDED.published_at, event_channels.published_at),
             last_error = EXCLUDED.last_error
           RETURNING *""",
        event_id, body.channel, body.status, body.external_url,
        body.external_event_id, body.scheduled_at, published_at, body.last_error,
    )
    return {"ok": True, "data": dict(row)}


@router.post("/content/generate")
async def generate_content_draft(
    body: GenerateContentPayload,
    event_id: str,
    user: dict = Depends(require_admin),
):
    pool = await get_pool()
    event = await pool.fetchrow("SELECT * FROM events WHERE id = $1", event_id)
    if not event:
        raise HTTPException(404, "Event not found.")

    event_url = f"https://startupa2z.org/events/{event['slug']}"
    prefix = {
        "announcement": "Join us",
        "reminder": "Reminder",
        "follow_up": "Thank you for joining us",
    }[body.content_type]
    if body.channel == "x":
        draft = f"{prefix}: {event['title']} — {event['date']} at {event['venue']}. {event_url}"
    elif body.channel == "linkedin":
        draft = (
            f"{prefix} for {event['title']} on {event['date']} at {event['venue']}.\n\n"
            f"{event['description']}\n\nDetails and registration: {event_url}"
        )
    else:
        draft = (
            f"{prefix} for {event['title']}\n\n{event['description']}\n\n"
            f"Date: {event['date']}\nTime: {event['time']}\nLocation: {event['venue']}\n\n"
            f"Register: {event_url}"
        )
    return {"ok": True, "data": {"title": event["title"], "body": draft}}


@router.post("/content")
async def create_content_item(body: ContentCreatePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    if not await pool.fetchval("SELECT 1 FROM events WHERE id = $1", body.event_id):
        raise HTTPException(404, "Event not found.")
    if not body.body.strip():
        raise HTTPException(400, "Content body is required.")
    published_at = datetime.now(timezone.utc) if body.status == "published" else None
    row = await pool.fetchrow(
        """INSERT INTO event_content_items
             (event_id, channel, content_type, title, body, status, scheduled_at, published_at, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           RETURNING *""",
        body.event_id, body.channel, body.content_type, body.title.strip(), body.body.strip(),
        body.status, body.scheduled_at, published_at, _created_by(user),
    )
    return {"ok": True, "data": dict(row)}


@router.put("/content/{content_id}")
async def update_content_item(
    content_id: str,
    body: ContentUpdatePayload,
    user: dict = Depends(require_admin),
):
    pool = await get_pool()
    sets: list[str] = []
    vals: list = []
    for field in ("channel", "content_type", "title", "body", "status"):
        value = getattr(body, field)
        if value is not None:
            vals.append(value.strip() if isinstance(value, str) else value)
            sets.append(f"{field} = ${len(vals)}")
    if body.clear_schedule:
        sets.append("scheduled_at = NULL")
    elif body.scheduled_at is not None:
        vals.append(body.scheduled_at)
        sets.append(f"scheduled_at = ${len(vals)}")
    if body.status == "published":
        sets.append("published_at = now()")
    if not sets:
        raise HTTPException(400, "No fields to update.")
    vals.append(content_id)
    row = await pool.fetchrow(
        f"UPDATE event_content_items SET {', '.join(sets)} WHERE id = ${len(vals)} RETURNING *",
        *vals,
    )
    if not row:
        raise HTTPException(404, "Content item not found.")
    return {"ok": True, "data": dict(row)}


@router.delete("/content/{content_id}")
async def delete_content_item(content_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    result = await pool.execute("DELETE FROM event_content_items WHERE id = $1", content_id)
    if result == "DELETE 0":
        raise HTTPException(404, "Content item not found.")
    return {"ok": True}


# ——— Image upload ————————————————————————————————————————————————————————————

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    if not file.content_type or file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "File must be a JPG, PNG, WebP, or GIF.")
    content = await file.read()
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image must be under 5 MB.")

    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs(IMAGES_DIR, exist_ok=True)
    with open(os.path.join(IMAGES_DIR, filename), "wb") as f:
        f.write(content)

    return {"ok": True, "url": f"/static/images/{filename}"}
