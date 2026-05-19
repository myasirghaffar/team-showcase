ALTER TABLE team_member_comments
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE team_member_comments
  ALTER COLUMN status SET DEFAULT 'approved';

UPDATE team_member_comments SET status = 'approved' WHERE status IS DISTINCT FROM 'approved';
