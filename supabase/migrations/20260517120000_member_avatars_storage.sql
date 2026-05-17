-- Public bucket for team member profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'member-avatars',
  'member-avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read member avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-avatars');

CREATE POLICY "Authenticated upload member avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-avatars');

CREATE POLICY "Authenticated update member avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-avatars')
WITH CHECK (bucket_id = 'member-avatars');

CREATE POLICY "Authenticated delete member avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-avatars');
