CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  role TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to submit the contact form
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT policy: PII (emails, names, LinkedIn URLs) is protected.
-- Only the project owner can read submissions via the Lovable Cloud dashboard.