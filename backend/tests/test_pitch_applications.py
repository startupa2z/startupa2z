import pytest
from pydantic import ValidationError

from routers.pitch_applications import PitchDraft, PitchSubmission


def valid_submission(**overrides):
    payload = {
        "event_id": "cdbc3de4-fdac-4de7-ba03-f3e2605e5409",
        "startup_name": "Test Startup",
        "startup_website": "https://example.com",
        "startup_summary": "A sufficiently detailed description of the startup and customer problem.",
        "problem": "Customers could not complete the workflow without repeated manual effort.",
        "solution": "The startup built and validated a simpler guided workflow for those customers.",
        "monetization_challenge": "Early pricing assumptions did not reflect the buyer's purchasing process.",
        "breakthrough": "The team narrowed the customer segment and changed the offer based on evidence.",
        "lessons": ["Validate the buyer", "Test pricing early", "Narrow the first use case"],
        "ask_text": "Introductions to design partners",
        "offer_text": "Practical customer discovery lessons",
        "consent_to_review": True,
    }
    payload.update(overrides)
    return payload


def test_draft_trims_and_removes_empty_lessons():
    draft = PitchDraft(lessons=[" First lesson ", "", " Second lesson "])
    assert draft.lessons == ["First lesson", "Second lesson"]


def test_submission_requires_exactly_three_lessons():
    with pytest.raises(ValidationError):
        PitchSubmission(**valid_submission(lessons=["One", "Two"]))


def test_submission_accepts_complete_application():
    submission = PitchSubmission(**valid_submission())
    assert submission.consent_to_review is True
    assert submission.startup_name == "Test Startup"
