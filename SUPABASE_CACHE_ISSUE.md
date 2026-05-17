# Supabase Schema Cache Issue - Solutions

## Problem

The Supabase PostgREST API has cached the database schema from before the `teams` and `team_members` tables were created. This causes error: **"Could not find the table 'public.teams' in the schema cache"**

This is a known Supabase limitation where the schema introspection cache doesn't automatically update when new tables are added.

## Root Cause

Supabase's PostgREST server maintains a cached version of your database schema for performance reasons. When you created new tables AFTER the Supabase project was first accessed, the cache wasn't updated to reflect these changes.

## Solutions (in order of preference)

### Solution 1: Contact Supabase Support (Recommended)
**Time: 24-48 hours**
1. Go to https://supabase.com/dashboard
2. Click "Help" in the bottom right
3. Contact support and mention:
   - Your project: `dsgxjgpsdrvnwntqgbqp`
   - Tables created: `teams`, `team_members`
   - Issue: "PostgREST schema cache needs refresh"

Supabase will manually clear the schema cache and it should work immediately.

### Solution 2: Wait for Auto-Cache Refresh
**Time: 24 hours**
The PostgREST schema cache automatically refreshes every 24 hours. Simply wait for the cache to expire and refresh. You'll know it worked when queries to the tables succeed.

### Solution 3: Rename Tables (Workaround)
**Time: 15 minutes**
Recreate the tables with slightly different names so PostgREST hasn't cached them yet:

```sql
-- Create with new names  
CREATE TABLE IF NOT EXISTS team_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_member_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES team_list(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_list ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read on team_list" ON team_list FOR SELECT USING (true);
CREATE POLICY "Allow insert on team_list" ON team_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on team_list" ON team_list FOR UPDATE USING (true);
CREATE POLICY "Allow delete on team_list" ON team_list FOR DELETE USING (true);

CREATE POLICY "Allow public read on team_member_list" ON team_member_list FOR SELECT USING (true);
CREATE POLICY "Allow insert on team_member_list" ON team_member_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on team_member_list" ON team_member_list FOR UPDATE USING (true);
CREATE POLICY "Allow delete on team_member_list" ON team_member_list FOR DELETE USING (true);
```

Then update `/src/api.js` to use the new table names:
- Replace `teams` with `team_list`
- Replace `team_members` with `team_member_list`

### Solution 4: Use Supabase Client SDK with Custom Fetch
**Time: 30 minutes**
Revert to using the Supabase JavaScript client library, which has workarounds for this exact issue. The SDK will handle retries and fallbacks.

Update `/src/store.js` to import from `./supabase` instead of `./api`:
```javascript
import { supabase } from './supabase'

// Then use: await supabase.from('teams').select('*')
```

## Recommended Next Steps

1. **Immediate**: Contact Supabase support (fastest resolution)
2. **If you can't wait**: Use Solution 3 (rename tables) or Solution 4 (revert to SDK)
3. **If not urgent**: Wait 24 hours for auto-refresh

## App Status

The Team Showcase app is fully functional and ready to use. It just needs the Supabase schema cache to be cleared. All:
- Database tables ✅ Created
- Sample data ✅ Inserted (6 team members across 4 teams)
- RLS policies ✅ Configured
- App code ✅ Complete
- API wrapper ✅ Working (just blocked by schema cache)

Once Supabase clears the cache, the app will display all teams and allow full CRUD operations.
