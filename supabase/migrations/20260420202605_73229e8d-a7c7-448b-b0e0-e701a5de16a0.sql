-- Create RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_slug TEXT NOT NULL,
  event_title TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RSVP (public form)
CREATE POLICY "Anyone can submit RSVPs"
ON public.event_rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND char_length(event_slug) BETWEEN 1 AND 200
  AND char_length(event_title) BETWEEN 1 AND 300
);

-- Only admins can view RSVPs
CREATE POLICY "Admins can view all RSVPs"
ON public.event_rsvps
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete RSVPs
CREATE POLICY "Admins can delete RSVPs"
ON public.event_rsvps
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_event_slug ON public.event_rsvps(event_slug);
CREATE INDEX idx_event_rsvps_created_at ON public.event_rsvps(created_at DESC);