---
name: startupa2z-event-operations
description: Plan, create, synchronize, review, and safely release StartupA2Z events across the website, Luma, banners, SEO, campaigns, and attendee communication. Use for any StartupA2Z event creation, speaker session, event update, cancellation, or post-event learning workflow.
---

# StartupA2Z Event Operations

Produce one consistent event experience across every approved channel while preserving production data and explicit external-action gates.

## Start with current truth

1. Read the editable Event Operations Playbook in the StartupA2Z admin module. If the local app is unavailable, inspect the seeded prompt in `backend/event_playbook.py` from the active StartupA2Z repository.
2. Inspect the current live Luma listing, live StartupA2Z pages, repository status, production event record, and existing assets relevant to the named event.
3. Treat the latest saved admin playbook as operating guidance, but flag any instruction that conflicts with the user's current request, verified live state, privacy, or approval boundaries.

## Preserve these invariants

- Production event, registration, and member data are authoritative. Never reconcile production from stale local data.
- Keep drafts, local saves, deployments, live verification, and external publication clearly distinct.
- Use the official StartupA2Z logo unchanged unless Satz explicitly replaces it.
- Never publish or edit Luma, deploy, send attendee messages, post socially, spend, cancel, or change accounts without Satz's explicit approval at the moment of action.
- Do not store secrets or attendee personal information in prompts, skills, logs, or creative assets.
- Keep established URLs when practical. If a slug must change, implement and verify a redirect before release.

## Event workflow

- Confirm or mark unknown: title, promise, audience, date, time, venue, capacity, price, registration URL, speaker identity and permissioned assets, session length, agenda, CTA, and communication plan.
- Audit every surface that currently exposes the event before proposing edits.
- Prepare synchronized event copy and coordinated Luma plus 16:9 website/social creative.
- Implement local code and narrowly targeted database changes. Update homepage feature, event listing, detail page, structured data, metadata, sitemap/prerender coverage, and verification tests when affected.
- Test locally across mobile and desktop. Search for stale event-specific copy and verify every RSVP path.
- Present the local result and remaining decisions before requesting any external action.
- After approved release, verify rendered live pages—not only HTTP status—and record only evidence-backed reusable lessons in the admin playbook as a new revision.

## Luma formatting standard

Whenever Satz asks to create or change a Luma event, treat presentation quality as part of the requested change—not as optional polish.

- Use Luma's rich-text structure. Never replace a formatting-rich description with one plain-text value; newline-only text can collapse into a single paragraph on the public page.
- Organize the About section into short paragraphs with clear emphasized section labels: event promise, speaker introduction, speaker links, what attendees will learn, agenda, and final CTA.
- Put speaker/profile links in a real bulleted list with descriptive linked labels. Put every learning outcome in its own bullet.
- Put every agenda item in its own bullet with the time range emphasized, followed by one concise activity label. Never combine multiple timings into one paragraph.
- Prefer rich HTML paste or Luma's formatting controls when editing a rich-text field. Do not use a plain `setValue`/textarea replacement when headings, links, or lists must survive.
- Before saving, verify that the editor exposes distinct paragraphs, real list containers/list markers, working links, and one agenda item per bullet.
- After saving, open the public Luma event page and verify the rendered spacing, headings, bullets, timings, links, cover, title, date, and venue. Do not report completion from the editor state alone.
- If Luma indicates that guests will receive an update, stop immediately before the final save and obtain separate action-time approval for the notification.

## Learning loop

At the end of substantial event work, identify what failed, what saved time, and what should change next time. Add durable improvements to the admin playbook when the user has placed local playbook maintenance in scope. Keep one-off event facts in the current-event section and reusable rules in the learning log. Never convert an assumption into a permanent rule.
