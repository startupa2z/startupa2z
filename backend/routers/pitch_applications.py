import json
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, HttpUrl, field_validator

from auth_middleware import get_current_user
from database import get_pool

router = APIRouter()

SupportNeed = Literal[
    "funding",
    "customers",
    "gtm",
    "staffing",
    "ai_development",
    "soc2_compliance",
    "legal",
    "cloud_cybersecurity",
    "product_development",
    "partnerships",
    "mentors_advisors",
]
SupportTimeline = Literal["right_now", "next_3_months", "exploring"]
PaidSupportInterest = Literal["actively_looking", "open_to_options", "not_now"]


class PitchDraft(BaseModel):
    id: UUID | None = None
    event_id: UUID | None = None
    startup_name: str | None = Field(default=None, max_length=160)
    startup_website: HttpUrl | None = None
    startup_summary: str | None = Field(default=None, max_length=500)
    talk_title: str | None = Field(default=None, max_length=160)
    problem: str | None = Field(default=None, max_length=4000)
    solution: str | None = Field(default=None, max_length=4000)
    monetization_challenge: str | None = Field(default=None, max_length=4000)
    breakthrough: str | None = Field(default=None, max_length=4000)
    lessons: list[str] = Field(default_factory=list, max_length=3)
    ask_text: str | None = Field(default=None, max_length=1000)
    offer_text: str | None = Field(default=None, max_length=1000)
    milestone: str | None = Field(default=None, max_length=1000)
    traction: str | None = Field(default=None, max_length=1000)
    pitch_deck_url: HttpUrl | None = None
    support_needs: list[SupportNeed] = Field(default_factory=list, max_length=11)
    support_timeline: SupportTimeline | None = None
    paid_support_interest: PaidSupportInterest | None = None

    @field_validator(
        "startup_name", "startup_summary", "talk_title", "problem", "solution",
        "monetization_challenge", "breakthrough", "ask_text", "offer_text", "milestone", "traction",
        mode="before",
    )
    @classmethod
    def clean_optional_text(cls, value):
        if value is None:
            return None
        cleaned = str(value).strip()
        return cleaned or None

    @field_validator("lessons")
    @classmethod
    def clean_lessons(cls, values: list[str]) -> list[str]:
        return [value.strip() for value in values if value.strip()][:3]

    @field_validator("support_needs")
    @classmethod
    def unique_support_needs(cls, values: list[SupportNeed]) -> list[SupportNeed]:
        return list(dict.fromkeys(values))


class PitchSubmission(PitchDraft):
    consent_to_review: Literal[True] = True


def _member_id(current_user: dict) -> str:
    user_id = current_user.get("sub")
    if not user_id or current_user.get("dev_admin") is True:
        raise HTTPException(401, "Member account required.")
    try:
        UUID(str(user_id))
    except (TypeError, ValueError):
        raise HTTPException(401, "Invalid member token.")
    return str(user_id)


def _serialize(row) -> dict | None:
    if not row:
        return None
    data = dict(row)
    if isinstance(data.get("lessons"), str):
        data["lessons"] = json.loads(data["lessons"])
    if isinstance(data.get("support_needs"), str):
        data["support_needs"] = json.loads(data["support_needs"])
    for field in ("id", "user_id", "event_id"):
        if data.get(field) is not None:
            data[field] = str(data[field])
    for field in ("submitted_at", "created_at", "updated_at"):
        if data.get(field) is not None:
            data[field] = data[field].isoformat()
    return data


async def _event(pool, event_id: UUID):
    row = await pool.fetchrow(
        "SELECT id, slug, title, date, time, venue FROM events WHERE id = $1",
        event_id,
    )
    if not row:
        raise HTTPException(422, "Select a valid event.")
    return row


@router.get("")
async def list_my_pitch_applications(current_user: dict = Depends(get_current_user)):
    user_id = _member_id(current_user)
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT * FROM pitch_applications
            WHERE user_id = $1
            ORDER BY updated_at DESC""",
        user_id,
    )
    return {"ok": True, "data": [_serialize(row) for row in rows]}


@router.get("/current")
async def get_current_pitch_application(current_user: dict = Depends(get_current_user)):
    user_id = _member_id(current_user)
    pool = await get_pool()
    row = await pool.fetchrow(
        """SELECT * FROM pitch_applications
            WHERE user_id = $1 AND status = 'draft'
            ORDER BY updated_at DESC
            LIMIT 1""",
        user_id,
    )
    return {"ok": True, "data": _serialize(row)}


@router.put("/draft")
async def save_pitch_draft(body: PitchDraft, current_user: dict = Depends(get_current_user)):
    user_id = _member_id(current_user)
    pool = await get_pool()
    event = await _event(pool, body.event_id) if body.event_id else None
    website = str(body.startup_website) if body.startup_website else None
    values = (
        body.event_id,
        event["slug"] if event else None,
        event["title"] if event else None,
        body.startup_name,
        website,
        body.startup_summary,
        body.talk_title,
        body.problem,
        body.solution,
        body.monetization_challenge,
        body.breakthrough,
        json.dumps(body.lessons),
        body.ask_text,
        body.offer_text,
        body.milestone,
        body.traction,
        str(body.pitch_deck_url) if body.pitch_deck_url else None,
        json.dumps(body.support_needs),
        body.support_timeline,
        body.paid_support_interest,
    )
    row = None
    if body.id:
        row = await pool.fetchrow(
            """UPDATE pitch_applications
                  SET event_id = $3, event_slug = $4, event_title = $5,
                      startup_name = $6, startup_website = $7, startup_summary = $8,
                      talk_title = $9, problem = $10, solution = $11,
                      monetization_challenge = $12, breakthrough = $13,
                      lessons = $14::jsonb, ask_text = $15, offer_text = $16, milestone = $17,
                      traction = $18, pitch_deck_url = $19,
                      support_needs = $20::jsonb, support_timeline = $21,
                      paid_support_interest = $22
                WHERE id = $1 AND user_id = $2 AND status = 'draft'
            RETURNING *""",
            body.id, user_id, *values,
        )
        if not row:
            raise HTTPException(404, "Pitch draft not found.")
    else:
        row = await pool.fetchrow(
            """INSERT INTO pitch_applications
                   (user_id, event_id, event_slug, event_title, startup_name, startup_website,
                    startup_summary, talk_title, problem, solution, monetization_challenge,
                    breakthrough, lessons, ask_text, offer_text, milestone, traction, pitch_deck_url,
                    support_needs, support_timeline, paid_support_interest)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14, $15, $16, $17, $18, $19::jsonb, $20, $21)
              RETURNING *""",
            user_id, *values,
        )
    return {"ok": True, "message": "Pitch draft saved.", "data": _serialize(row)}


@router.post("/submit", status_code=201)
async def submit_pitch_application(body: PitchSubmission, current_user: dict = Depends(get_current_user)):
    user_id = _member_id(current_user)
    pool = await get_pool()
    event = await _event(pool, body.event_id) if body.event_id else None
    duplicate = await pool.fetchval(
        """SELECT 1 FROM pitch_applications
            WHERE user_id = $1 AND event_id IS NOT DISTINCT FROM $2
              AND status IN ('submitted', 'under_review', 'approved')
              AND ($3::uuid IS NULL OR id <> $3)""",
        user_id, body.event_id, body.id,
    )
    if duplicate:
        raise HTTPException(409, "You already submitted a pitch application for this event.")

    website = str(body.startup_website) if body.startup_website else None
    values = (
        body.event_id, event["slug"] if event else None, event["title"] if event else None, body.startup_name,
        website, body.startup_summary, body.talk_title, body.problem, body.solution,
        body.monetization_challenge, body.breakthrough, json.dumps(body.lessons),
        body.ask_text, body.offer_text, body.milestone, body.traction,
        str(body.pitch_deck_url) if body.pitch_deck_url else None,
        json.dumps(body.support_needs), body.support_timeline, body.paid_support_interest,
    )
    if body.id:
        row = await pool.fetchrow(
            """UPDATE pitch_applications
                  SET event_id = $3, event_slug = $4, event_title = $5,
                      startup_name = $6, startup_website = $7, startup_summary = $8,
                      talk_title = $9, problem = $10, solution = $11,
                      monetization_challenge = $12, breakthrough = $13,
                      lessons = $14::jsonb, ask_text = $15, offer_text = $16, milestone = $17,
                      traction = $18, pitch_deck_url = $19,
                      support_needs = $20::jsonb, support_timeline = $21,
                      paid_support_interest = $22,
                      consent_to_review = true, status = 'submitted', submitted_at = now()
                WHERE id = $1 AND user_id = $2 AND status = 'draft'
            RETURNING *""",
            body.id, user_id, *values,
        )
        if not row:
            raise HTTPException(404, "Pitch draft not found or already submitted.")
    else:
        row = await pool.fetchrow(
            """INSERT INTO pitch_applications
                   (user_id, event_id, event_slug, event_title, startup_name, startup_website,
                    startup_summary, talk_title, problem, solution, monetization_challenge,
                    breakthrough, lessons, ask_text, offer_text, milestone, traction, pitch_deck_url,
                    support_needs, support_timeline, paid_support_interest, consent_to_review, status, submitted_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                         $13::jsonb, $14, $15, $16, $17, $18, $19::jsonb, $20, $21, true, 'submitted', now())
              RETURNING *""",
            user_id, *values,
        )
    return {"ok": True, "message": "Pitch application submitted for review.", "data": _serialize(row)}
