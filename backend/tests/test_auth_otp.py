import asyncio

import pytest
from fastapi import HTTPException

from routers import auth


class MissingAccountPool:
    def __init__(self):
        self.executed_queries: list[str] = []

    async def fetchrow(self, query, *args):
        if "FROM otp_tokens" in query:
            return {"id": "otp-id", "mode": "signin"}
        return None

    async def execute(self, query, *args):
        self.executed_queries.append(query)


def test_signin_for_missing_account_does_not_consume_valid_code(monkeypatch):
    pool = MissingAccountPool()

    async def fake_get_pool():
        return pool

    monkeypatch.setattr(auth, "get_pool", fake_get_pool)

    with pytest.raises(HTTPException) as error:
        asyncio.run(auth.verify_otp(auth.VerifyOtpRequest(email="new-member@example.com", token="123456")))

    assert error.value.status_code == 400
    assert error.value.detail == "No account found with this email. Please sign up first."
    assert not any("UPDATE otp_tokens SET used = true" in query for query in pool.executed_queries)
