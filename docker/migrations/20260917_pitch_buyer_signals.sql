ALTER TABLE pitch_applications
  ADD COLUMN IF NOT EXISTS support_needs JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS support_timeline TEXT,
  ADD COLUMN IF NOT EXISTS paid_support_interest TEXT;
