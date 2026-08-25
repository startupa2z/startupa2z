import csv
import io
import os
import uuid
from typing import Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import EmailStr, TypeAdapter, ValidationError

from all_users import enrich_all_users, upsert_all_user
from auth_middleware import require_admin
from database import get_pool

router = APIRouter()

MAX_CSV_BYTES = 5 * 1024 * 1024
EMAIL_ADAPTER = TypeAdapter(EmailStr)
ImportSource = Literal["luma_csv", "lead_csv", "other_csv"]

HEADER_ALIASES = {
    "email": {"email", "email address", "guest email", "emailaddress"},
    "full_name": {"name", "full name", "guest name", "fullname"},
    "first_name": {"first name", "firstname", "first_name"},
    "last_name": {"last name", "lastname", "last_name", "surname"},
    "phone": {"phone", "phone number", "mobile", "mobile number"},
    "company": {"company", "company name", "organization", "organisation"},
    "job_title": {"job title", "title", "role", "position"},
}


def _header_key(value: str | None) -> str:
    return " ".join((value or "").strip().lower().replace("_", " ").split())


def _column_map(fieldnames: list[str] | None) -> dict[str, str]:
    result: dict[str, str] = {}
    for original in fieldnames or []:
        normalized = _header_key(original)
        for field, aliases in HEADER_ALIASES.items():
            if normalized in aliases and field not in result:
                result[field] = original
    return result


def _clean(value: str | None) -> str | None:
    cleaned = (value or "").strip()
    return cleaned or None


@router.get("/all-users")
async def list_all_users(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT id, email, full_name, first_name, last_name, phone, company, job_title,
                  is_member, is_website_registrant, is_luma_attendee, is_lead,
                  marketing_consent, first_source, last_source, created_at, updated_at
                  , linkedin_url, enrichment_status, enrichment_sources, enriched_at
             FROM all_users
         ORDER BY updated_at DESC
            LIMIT 1000"""
    )
    return {"ok": True, "data": [dict(row) for row in rows]}


@router.get("/all-users/imports")
async def list_all_user_imports(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch(
        "SELECT * FROM all_user_imports ORDER BY created_at DESC LIMIT 20"
    )
    return {"ok": True, "data": [dict(row) for row in rows]}


@router.post("/all-users/import")
async def import_all_users_csv(
    file: UploadFile = File(...),
    source: ImportSource = Form("luma_csv"),
    user: dict = Depends(require_admin),
):
    filename = os.path.basename(file.filename or "contacts.csv")
    if not filename.lower().endswith(".csv"):
        raise HTTPException(400, "Upload a CSV file.")

    raw = await file.read(MAX_CSV_BYTES + 1)
    if len(raw) > MAX_CSV_BYTES:
        raise HTTPException(413, "CSV must be 5 MB or smaller.")
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(400, "CSV must use UTF-8 encoding.")

    try:
        dialect = csv.Sniffer().sniff(text[:4096], delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    columns = _column_map(reader.fieldnames)
    if "email" not in columns:
        raise HTTPException(400, "No email column found. Use a header such as Email or Email Address.")

    total_rows = 0
    invalid_rows = 0
    duplicate_rows = 0
    invalid_examples: list[dict] = []
    contacts: dict[str, dict] = {}
    for row_number, row in enumerate(reader, start=2):
        if not any(_clean(value) for value in row.values()):
            continue
        total_rows += 1
        raw_email = _clean(row.get(columns["email"]))
        try:
            normalized_email = str(EMAIL_ADAPTER.validate_python(raw_email)).strip().lower()
        except (ValidationError, TypeError):
            invalid_rows += 1
            if len(invalid_examples) < 5:
                invalid_examples.append({"row": row_number, "email": raw_email or "", "reason": "Invalid email"})
            continue

        full_name = _clean(row.get(columns.get("full_name", "")))
        first_name = _clean(row.get(columns.get("first_name", "")))
        last_name = _clean(row.get(columns.get("last_name", "")))
        if full_name and not first_name:
            first_name, _, inferred_last = full_name.partition(" ")
            last_name = last_name or _clean(inferred_last)
        if not full_name:
            full_name = " ".join(value for value in (first_name, last_name) if value) or None

        contact = {
            "email": normalized_email,
            "full_name": full_name,
            "first_name": first_name,
            "last_name": last_name,
            "phone": _clean(row.get(columns.get("phone", ""))),
            "company": _clean(row.get(columns.get("company", ""))),
            "job_title": _clean(row.get(columns.get("job_title", ""))),
        }
        if normalized_email in contacts:
            duplicate_rows += 1
            previous = contacts[normalized_email]
            contacts[normalized_email] = {
                key: value or previous.get(key) for key, value in contact.items()
            }
        else:
            contacts[normalized_email] = contact

    pool = await get_pool()
    normalized_emails = list(contacts)
    existing = set()
    if normalized_emails:
        existing_rows = await pool.fetch(
            "SELECT normalized_email FROM all_users WHERE normalized_email = ANY($1::text[])",
            normalized_emails,
        )
        existing = {row["normalized_email"] for row in existing_rows}

    created_rows = sum(1 for email in normalized_emails if email not in existing)
    updated_rows = len(normalized_emails) - created_rows
    created_by = None
    try:
        created_by = uuid.UUID(str(user.get("sub")))
    except (TypeError, ValueError, AttributeError):
        pass

    async with pool.acquire() as conn:
        async with conn.transaction():
            for contact in contacts.values():
                await upsert_all_user(conn, source=source, **contact)
            enrichment = await enrich_all_users(conn, normalized_emails)
            duplicate_emails_remaining = await conn.fetchval(
                """SELECT COUNT(*) FROM (
                       SELECT normalized_email
                         FROM all_users
                     GROUP BY normalized_email
                       HAVING COUNT(*) > 1
                   ) duplicates"""
            )
            malformed_email_keys = await conn.fetchval(
                "SELECT COUNT(*) FROM all_users WHERE normalized_email <> lower(trim(email))"
            )
            dedupe_verified = duplicate_emails_remaining == 0 and malformed_email_keys == 0
            if not dedupe_verified:
                raise HTTPException(500, "Import was rolled back because uniqueness verification failed.")
            await conn.execute(
                """INSERT INTO all_user_imports
                          (filename, source, total_rows, created_rows, updated_rows,
                           invalid_rows, duplicate_rows, enriched_rows, enrichment_matches,
                           fields_enriched, dedupe_verified, completed_at, created_by)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now(), $12)""",
                filename,
                source,
                total_rows,
                created_rows,
                updated_rows,
                invalid_rows,
                duplicate_rows,
                enrichment["enriched_rows"],
                enrichment["enrichment_matches"],
                enrichment["fields_enriched"],
                dedupe_verified,
                created_by,
            )
    total_all_users = await pool.fetchval("SELECT COUNT(*) FROM all_users")
    return {
        "ok": True,
        "data": {
            "filename": filename,
            "source": source,
            "total_rows": total_rows,
            "valid_unique_rows": len(contacts),
            "created_rows": created_rows,
            "updated_rows": updated_rows,
            "invalid_rows": invalid_rows,
            "duplicate_rows": duplicate_rows,
            "total_all_users": total_all_users,
            "invalid_examples": invalid_examples,
            "dedupe_verified": dedupe_verified,
            "duplicate_emails_remaining": duplicate_emails_remaining,
            "enrichment_status": "completed",
            **enrichment,
        },
    }
