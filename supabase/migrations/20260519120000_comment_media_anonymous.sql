-- Allow anonymous comments and optional text with media attachments
ALTER TABLE team_member_comments
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN comment DROP NOT NULL;

ALTER TABLE team_member_comments
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

ALTER TABLE team_member_comments
  DROP CONSTRAINT IF EXISTS team_member_comments_media_type_check;

ALTER TABLE team_member_comments
  ADD CONSTRAINT team_member_comments_media_type_check
  CHECK (media_type IS NULL OR media_type IN ('image', 'video'));

-- Comment media storage (public read; guests can upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comment-media',
  'comment-media',
  true,
  26214400,
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read comment media" ON storage.objects;
CREATE POLICY "Public read comment media"
ON storage.objects FOR SELECT
USING (bucket_id = 'comment-media');

DROP POLICY IF EXISTS "Anyone upload comment media" ON storage.objects;
CREATE POLICY "Anyone upload comment media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'comment-media');
