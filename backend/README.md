# StartupA2Z.org Backend

FastAPI service for events, RSVPs, contact submissions, authentication, Stripe,
and administration. PostgreSQL is accessed through `asyncpg`.

## Local Docker setup

Run the complete stack from the repository root:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
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
| POST | `/api/stripe/create-checkout-session` | Start the $2,000 sponsorship checkout |
| GET | `/api/stripe/checkout-session/{id}` | Verify the customer return status |
| POST | `/api/stripe/webhook` | Process signed Stripe payment events |
| GET | `/api/admin/sponsor-payments` | List sponsorship payments for admins |

## Stripe test-mode verification

Use a Stripe test secret key (`sk_test_...`) and a test webhook signing secret
(`whsec_...`) in the repository-root `.env`. Start the stack, then forward test
events with the Stripe CLI:

```bash
stripe listen \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired,charge.refunded,charge.dispute.created \
  --forward-to http://localhost:8081/api/stripe/webhook
```

Open `http://localhost:8081/sponsorship`, purchase the Session Sponsor package,
and use Stripe's successful test card `4242 4242 4242 4242`, any future expiry,
any three-digit security code, and any postal code. Confirm that the return page
shows a verified payment and that the admin Payments section shows a TEST payment.

For an existing database, apply
`docker/migrations/20260809_sponsor_payments.sql` before testing. New databases
receive the schema from `docker/init.sql`.

Configuration is read from `backend/.env` when present or from container
environment variables. See `backend/.env.example`.
