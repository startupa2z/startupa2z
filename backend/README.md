# StartupA2Z.org Backend

FastAPI service for events, RSVPs, contact submissions, authentication, Stripe,
and administration. PostgreSQL is accessed through `asyncpg`.

## Local Docker setup

Run the complete stack from the repository root:

```bash
docker compose up -d --build
```

The frontend proxies `/api` and `/health` to the backend container.

## Main endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/events` | List events |
| GET | `/api/events/{slug}` | Retrieve an event |
| POST | `/api/rsvp` | Register for an event |
| POST | `/api/contact` | Submit the contact form |
| POST | `/api/auth/otp/send` | Send an authentication code |
| POST | `/api/auth/otp/verify` | Verify an authentication code |

Configuration is read from `backend/.env` when present or from container
environment variables. See `backend/.env.example`.
