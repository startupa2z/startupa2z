import json
import os
import re
import uuid
from typing import Literal

from asyncpg import UniqueViolationError
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator, model_validator

from database import get_pool


router = APIRouter()

BUSINESS_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images", "businesses")
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:80] or "startup"


def _clean_optional_text(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


def _validate_media_url(value: str | None) -> str | None:
    value = _clean_optional_text(value)
    if value is None:
        return None
    if not (value.startswith("https://") or value.startswith("http://") or value.startswith("/static/")):
        raise ValueError("Use a complete media URL or an uploaded image.")
    return value


def _normalize_profile_points(value: str | None) -> str | None:
    value = _clean_optional_text(value)
    if value is None:
        return None
    points = [re.sub(r"^\s*(?:[-*•]|\d+[.)])\s*", "", line).strip() for line in value.splitlines()]
    points = [point for point in points if point]
    if len(points) > 3:
        raise ValueError("Use no more than 3 points.")
    if any(len(point) > 120 for point in points):
        raise ValueError("Keep each point to 120 characters or fewer.")
    return "\n".join(points)


class FounderSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    role: str = Field(min_length=2, max_length=50)
    linkedin_url: HttpUrl | None = None
    journey: str | None = Field(default=None, max_length=2000)
    photo_url: str | None = Field(default=None, max_length=500)

    @field_validator("name", "role")
    @classmethod
    def trim_name(cls, value: str) -> str:
        return value.strip()

    @field_validator("journey", mode="before")
    @classmethod
    def trim_journey(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)

    @field_validator("photo_url", mode="before")
    @classmethod
    def validate_photo_url(cls, value: str | None) -> str | None:
        return _validate_media_url(value)


class MediaSubmission(BaseModel):
    media_type: Literal["image", "video"]
    url: str = Field(min_length=1, max_length=500)
    caption: str | None = Field(default=None, max_length=200)

    @field_validator("url", mode="before")
    @classmethod
    def validate_url(cls, value: str) -> str:
        cleaned = _validate_media_url(value)
        if cleaned is None:
            raise ValueError("Media URL is required.")
        return cleaned

    @field_validator("caption", mode="before")
    @classmethod
    def trim_caption(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)


class BusinessChannelSubmission(BaseModel):
    label: Literal["LinkedIn", "X"]
    url: HttpUrl


class BusinessSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    pitch: str = Field(min_length=20, max_length=280)
    stage: str = Field(min_length=2, max_length=50)
    location: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=50)
    tags: list[str] = Field(default_factory=list, max_length=5)
    website_url: HttpUrl | None = None
    logo_url: str | None = Field(default=None, max_length=500)
    journey: str = Field(min_length=20, max_length=4000)
    challenges: str | None = Field(default=None, max_length=3000)
    challenge_solution: str | None = Field(default=None, max_length=3000)
    ask_text: str | None = Field(default=None, max_length=3000)
    offer_text: str | None = Field(default=None, max_length=3000)
    founded_year: int | None = Field(default=None, ge=1800, le=2200)
    team_size: int | None = Field(default=None, ge=1, le=100000)
    channels: list[BusinessChannelSubmission] = Field(default_factory=list, max_length=2)
    founders: list[FounderSubmission] = Field(min_length=1, max_length=5)
    media: list[MediaSubmission] = Field(default_factory=list, max_length=6)
    contact_name: str = Field(min_length=2, max_length=100)
    contact_email: EmailStr
    consent_to_publish: bool

    @field_validator("name", "pitch", "stage", "location", "category", "journey", "contact_name")
    @classmethod
    def trim_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("challenges", "challenge_solution", mode="before")
    @classmethod
    def trim_optional_text(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)

    @field_validator("ask_text", "offer_text", mode="before")
    @classmethod
    def normalize_points(cls, value: str | None) -> str | None:
        return _normalize_profile_points(value)

    @field_validator("logo_url", mode="before")
    @classmethod
    def validate_logo_url(cls, value: str | None) -> str | None:
        return _validate_media_url(value)

    @field_validator("tags")
    @classmethod
    def clean_tags(cls, values: list[str]) -> list[str]:
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
    def validate_profile_counts(self):
        image_count = sum(item.media_type == "image" for item in self.media)
        video_count = sum(item.media_type == "video" for item in self.media)
        if image_count > 3:
            raise ValueError("A profile can contain up to 3 photos.")
        if video_count > 3:
            raise ValueError("A profile can contain up to 3 videos.")
        if self.team_size is not None and self.team_size < len(self.founders):
            raise ValueError("Team size cannot be smaller than the number of listed founders.")
        return self


PUBLIC_COLUMNS = """
    id, slug, name, pitch, stage, location, category, tags, website_url,
    logo_url, journey, challenges, challenge_solution, ask_text, offer_text,
    founded_year, team_size, company_status, channels, created_at
"""


async def _related_records(pool, business_ids: list[uuid.UUID]):
    if not business_ids:
        return {}, {}
    founder_rows = await pool.fetch(
        """SELECT id, business_id, slug, name, role, linkedin_url, journey, photo_url,
                  directory_visible, display_order
             FROM business_founders WHERE business_id = ANY($1::uuid[])
             ORDER BY display_order, created_at""",
        business_ids,
    )
    media_rows = await pool.fetch(
        """SELECT id, business_id, media_type, url, caption, display_order
             FROM business_media WHERE business_id = ANY($1::uuid[])
             ORDER BY display_order, created_at""",
        business_ids,
    )
    founders: dict[uuid.UUID, list[dict]] = {}
    media: dict[uuid.UUID, list[dict]] = {}
    for row in founder_rows:
        founders.setdefault(row["business_id"], []).append(dict(row))
    for row in media_rows:
        media.setdefault(row["business_id"], []).append(dict(row))
    return founders, media


def _public_founder(row) -> dict:
    return {
        "id": row["id"],
        "slug": row["founder_slug"],
        "name": row["founder_name"],
        "role": row["founder_role"],
        "linkedin_url": row["linkedin_url"],
        "journey": row["founder_journey"],
        "photo_url": row["photo_url"],
        "company": {
            "id": row["business_id"],
            "slug": row["business_slug"],
            "name": row["business_name"],
            "pitch": row["pitch"],
            "stage": row["stage"],
            "location": row["location"],
            "category": row["category"],
            "tags": row["tags"],
            "logo_url": row["logo_url"],
            "ask_text": row["ask_text"],
            "offer_text": row["offer_text"],
        },
    }


def _public_business(row, founders: dict, media: dict) -> dict:
    item = dict(row)
    if isinstance(item.get("channels"), str):
        item["channels"] = json.loads(item["channels"])
    business_id = row["id"]
    item["founders"] = founders.get(business_id, [])
    item["media"] = media.get(business_id, [])
    return item


@router.post("/media/upload", status_code=201)
async def upload_business_image(file: UploadFile = File(...)):
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(415, "Upload a JPG, PNG, or WebP image.")
    content = await file.read(MAX_IMAGE_BYTES + 1)
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Images must be 5 MB or smaller.")
    if not content:
        raise HTTPException(422, "The uploaded image is empty.")

    os.makedirs(BUSINESS_IMAGES_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    with open(os.path.join(BUSINESS_IMAGES_DIR, filename), "wb") as output:
        output.write(content)
    return {"ok": True, "url": f"/static/images/businesses/{filename}"}


@router.get("")
async def list_businesses():
    pool = await get_pool()
    rows = await pool.fetch(
        f"""SELECT {PUBLIC_COLUMNS}
              FROM businesses
             WHERE published = true
             ORDER BY created_at DESC"""
    )
    founders, media = await _related_records(pool, [row["id"] for row in rows])
    return {"ok": True, "data": [_public_business(row, founders, media) for row in rows]}


FOUNDER_DIRECTORY_QUERY = """
    SELECT bf.id, bf.slug AS founder_slug, bf.name AS founder_name,
           bf.role AS founder_role, bf.linkedin_url, bf.journey AS founder_journey,
           bf.photo_url, b.id AS business_id, b.slug AS business_slug,
           b.name AS business_name, b.pitch, b.stage, b.location, b.category,
           b.tags, b.logo_url, b.ask_text, b.offer_text
      FROM business_founders bf
      JOIN businesses b ON b.id = bf.business_id
     WHERE b.published = true
       AND bf.directory_visible = true
"""


@router.get("/founders")
async def list_founders():
    pool = await get_pool()
    rows = await pool.fetch(
        FOUNDER_DIRECTORY_QUERY + " ORDER BY bf.created_at DESC, bf.display_order, bf.name"
    )
    return {"ok": True, "data": [_public_founder(row) for row in rows]}


@router.get("/founders/{slug}")
async def get_founder(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow(FOUNDER_DIRECTORY_QUERY + " AND bf.slug = $1", slug)
    if not row:
        raise HTTPException(404, "Founder not found.")
    return {"ok": True, "data": _public_founder(row)}


@router.get("/{slug}")
async def get_business(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow(
        f"SELECT {PUBLIC_COLUMNS} FROM businesses WHERE slug = $1 AND published = true",
        slug,
    )
    if not row:
        raise HTTPException(404, "Business not found.")
    founders, media = await _related_records(pool, [row["id"]])
    return {"ok": True, "data": _public_business(row, founders, media)}


@router.post("", status_code=201)
async def submit_business(body: BusinessSubmission):
    if not body.consent_to_publish:
        raise HTTPException(422, "You must confirm that this information can be published.")

    pool = await get_pool()
    base_slug = _slugify(body.name)
    slug = base_slug
    suffix = 2
    while await pool.fetchval("SELECT 1 FROM businesses WHERE slug = $1", slug):
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                row = await connection.fetchrow(
                    f"""INSERT INTO businesses
                           (slug, name, pitch, stage, location, category, tags, website_url,
                            logo_url, journey, challenges, challenge_solution, ask_text, offer_text,
                            founded_year, team_size, channels, contact_name, contact_email, published, status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19, false, 'pending')
                         RETURNING {PUBLIC_COLUMNS}""",
                    slug,
                    body.name,
                    body.pitch,
                    body.stage,
                    body.location,
                    body.category,
                    body.tags,
                    str(body.website_url) if body.website_url else None,
                    body.logo_url,
                    body.journey,
                    body.challenges,
                    body.challenge_solution,
                    body.ask_text,
                    body.offer_text,
                    body.founded_year,
                    body.team_size,
                    json.dumps([channel.model_dump(mode="json") for channel in body.channels]),
                    body.contact_name,
                    str(body.contact_email),
                )
                for index, founder in enumerate(body.founders):
                    founder_slug = _slugify(founder.name)
                    suffix = 2
                    while await connection.fetchval("SELECT 1 FROM business_founders WHERE slug = $1", founder_slug):
                        founder_slug = f"{_slugify(founder.name)}-{suffix}"
                        suffix += 1
                    await connection.execute(
                        """INSERT INTO business_founders
                               (business_id, slug, name, role, linkedin_url, journey, photo_url,
                                directory_visible, display_order)
                             VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)""",
                        row["id"], founder_slug, founder.name, founder.role,
                        str(founder.linkedin_url) if founder.linkedin_url else None,
                        founder.journey, founder.photo_url, index,
                    )
                for index, media_item in enumerate(body.media):
                    await connection.execute(
                        """INSERT INTO business_media
                               (business_id, media_type, url, caption, display_order)
                             VALUES ($1, $2, $3, $4, $5)""",
                        row["id"], media_item.media_type, media_item.url, media_item.caption, index,
                    )
    except UniqueViolationError:
        raise HTTPException(409, "A business with this name is already submitted.")

    return {
        "ok": True,
        "message": "Your business was submitted for review.",
        "data": {**dict(row), "founders": [founder.model_dump(mode="json") for founder in body.founders], "media": [item.model_dump() for item in body.media]},
    }
