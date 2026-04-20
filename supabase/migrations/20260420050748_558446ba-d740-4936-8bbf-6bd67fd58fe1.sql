DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT first_name_length CHECK (char_length(first_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT last_name_length CHECK (char_length(last_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT linkedin_length CHECK (linkedin_url IS NULL OR char_length(linkedin_url) <= 500),
  ADD CONSTRAINT role_length CHECK (role IS NULL OR char_length(role) <= 50),
  ADD CONSTRAINT inquiry_type_length CHECK (char_length(inquiry_type) BETWEEN 1 AND 50),
  ADD CONSTRAINT message_length CHECK (message IS NULL OR char_length(message) <= 2000);

CREATE POLICY "Public can submit validated contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND char_length(inquiry_type) BETWEEN 1 AND 50
);