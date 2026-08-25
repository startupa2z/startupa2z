BEGIN;

CREATE TABLE IF NOT EXISTS sponsor_payments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT        NOT NULL UNIQUE,
  payment_status    TEXT,
  amount_total      INTEGER,
  currency          TEXT,
  customer_email    TEXT,
  customer_name     TEXT,
  package_id        TEXT,
  package_name      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sponsor_payments
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS amount_refunded INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS livemode BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE sponsor_payments SET payment_status = 'unpaid' WHERE payment_status IS NULL;
UPDATE sponsor_payments SET amount_total = 0 WHERE amount_total IS NULL;
UPDATE sponsor_payments SET currency = 'usd' WHERE currency IS NULL;

ALTER TABLE sponsor_payments
  ALTER COLUMN payment_status SET DEFAULT 'unpaid',
  ALTER COLUMN payment_status SET NOT NULL,
  ALTER COLUMN amount_total SET DEFAULT 0,
  ALTER COLUMN amount_total SET NOT NULL,
  ALTER COLUMN currency SET DEFAULT 'usd',
  ALTER COLUMN currency SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS sponsor_payments_payment_intent_unique_idx
  ON sponsor_payments (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS sponsor_payments_created_at_idx
  ON sponsor_payments (created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sponsor_payments_fulfillment_status_check'
  ) THEN
    ALTER TABLE sponsor_payments
      ADD CONSTRAINT sponsor_payments_fulfillment_status_check
      CHECK (fulfillment_status IN ('pending', 'contacted', 'fulfilled'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sponsor_payments_amount_total_check'
  ) THEN
    ALTER TABLE sponsor_payments
      ADD CONSTRAINT sponsor_payments_amount_total_check CHECK (amount_total >= 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sponsor_payments_amount_refunded_check'
  ) THEN
    ALTER TABLE sponsor_payments
      ADD CONSTRAINT sponsor_payments_amount_refunded_check CHECK (amount_refunded >= 0);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  stripe_event_id TEXT        PRIMARY KEY,
  event_type      TEXT        NOT NULL,
  livemode        BOOLEAN     NOT NULL DEFAULT false,
  processed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
