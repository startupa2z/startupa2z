-- Add image URL column
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create public bucket for event cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Event images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Admins can upload
CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));