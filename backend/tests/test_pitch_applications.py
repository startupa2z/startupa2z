from routers.pitch_applications import PitchDraft, PitchSubmission
from routers.admin import PitchApplicationReviewPayload


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
        "support_needs": ["customers", "gtm", "soc2_compliance"],
        "support_timeline": "right_now",
        "paid_support_interest": "actively_looking",
        "consent_to_review": True,
    }
    payload.update(overrides)
    return payload


def test_draft_trims_and_removes_empty_lessons():
    draft = PitchDraft(lessons=[" First lesson ", "", " Second lesson "])
    assert draft.lessons == ["First lesson", "Second lesson"]


def test_submission_accepts_partial_answers():
    submission = PitchSubmission(startup_name="Early idea")
    assert submission.startup_name == "Early idea"
    assert submission.event_id is None
    assert submission.consent_to_review is True


def test_submission_accepts_complete_application():
    submission = PitchSubmission(**valid_submission())
    assert submission.consent_to_review is True
    assert submission.startup_name == "Test Startup"
    assert submission.support_needs == ["customers", "gtm", "soc2_compliance"]
    assert submission.paid_support_interest == "actively_looking"


def test_support_needs_remove_duplicates_without_becoming_required():
    draft = PitchDraft(support_needs=["staffing", "staffing", "ai_development"])
    assert draft.support_needs == ["staffing", "ai_development"]
    assert draft.support_timeline is None


def test_admin_review_payload_cleans_notes():
    review = PitchApplicationReviewPayload(status="under_review", admin_notes="  Needs event fit review.  ")
    assert review.admin_notes == "Needs event fit review."
