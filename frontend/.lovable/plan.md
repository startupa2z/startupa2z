
The user wants the Contact form submissions to be saved to Supabase. Currently the form just shows a toast — no backend wiring. I need to enable Lovable Cloud (Supabase), create a table for submissions, and wire the form to insert into it.

## Plan

### 1. Enable Lovable Cloud
Provision Supabase backend for the project (one-click, no external account needed). This gives us the Supabase client and DB.

### 2. Create `contact_submissions` table
Schema:
- `id` (uuid, PK, default gen_random_uuid())
- `created_at` (timestamptz, default now())
- `first_name` (text, required)
- `last_name` (text, required)
- `email` (text, required)
- `linkedin_url` (text, nullable)
- `role` (text, nullable) — from "I am a..." dropdown
- `inquiry_type` (text, required)
- `message` (text, nullable)

### 3. Row Level Security
Enable RLS with these policies:
- **INSERT**: allow anyone (anonymous public) to submit the form — `WITH CHECK (true)`
- **SELECT**: deny all by default (no policy) — submissions contain PII (emails, names, LinkedIn) so only the org owner should read them via the Supabase dashboard. No public read access.

### 4. Wire up the form (`src/pages/Contact.tsx`)
- Convert all inputs/selects to controlled components with React state
- Add zod schema validation matching the table constraints (email format, required fields, max lengths)
- On submit: call `supabase.from('contact_submissions').insert(...)`, show success toast on success or error toast on failure, reset the form
- Add loading state on the Submit button (disabled + "Sending...")

### 5. Technical notes
- Uses the auto-generated Supabase client from Lovable Cloud (no manual config)
- All validation is both client-side (zod) and DB-enforced (NOT NULL constraints)
- No auth required to submit — public form
- PII is protected by denying public SELECT access

### Note on "startupa2z's Org supabase"
Lovable Cloud provisions a managed Supabase project automatically — no external Supabase account connection needed. If you specifically want to connect an existing external Supabase project belonging to your org instead, let me know and I'll switch to the Supabase Connection flow.

