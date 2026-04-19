-- Public bucket for vinyl audio previews (admin upload, public listen)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-audio', 'product-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Audio previews are publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-audio');

-- Only admins can upload / update / delete
CREATE POLICY "Admins can upload audio previews"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update audio previews"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete audio previews"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));