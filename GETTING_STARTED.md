# Getting Started - Quick Setup Checklist

Follow these steps to get your Team Showcase app up and running in minutes.

## Step 1: Verify Installation ✅

The app is already scaffolded with all dependencies installed. You should have:
- ✅ React 19
- ✅ Vite development server
- ✅ Tailwind CSS
- ✅ React Router
- ✅ Zustand state management
- ✅ Supabase JavaScript client

## Step 2: Set Up Supabase Database 🔧

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Select your organization
4. Enter a project name (e.g., "team-showcase")
5. Create a secure password
6. Select your region
7. Click **"Create new project"** (takes 1-2 minutes)

### Set Up Database Tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy all content from `supabase/schema.sql` in this project
4. Paste into the SQL editor
5. Click **"Run"** ▶️
6. You should see: ✅ "Success. No rows returned"

### Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Click **"API"** in the left menu
3. Copy your **Project URL**
4. Copy your **Anon Public Key**

## Step 3: Configure Environment 🌍

1. Open `.env.local` in the project root
2. Paste your credentials:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

**Important**: 
- Don't commit `.env.local` to git (it's in `.gitignore`)
- These are public credentials and it's safe to use them (RLS controls access)

## Step 4: Start Development Server 🚀

```bash
pnpm dev
```

You should see:
```
  VITE v8.0.13  ready in 233 ms
  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 5: Try the App 🎉

### Create Your First Team
1. Click **"+ New Team"** button in top right
2. Fill in:
   - Team Name: "Engineering" (required)
   - Department: "Technology"
   - Description: "Our amazing engineering team"
3. Click **"Create Team"**

### Add Team Members
1. Click on the "Engineering" team
2. Click **"+ Add Member"**
3. Fill in member details:
   - Name: "Alice Johnson" (required)
   - Role: "Senior Developer"
   - Email: "alice@company.com"
   - Other info: optional
4. Click **"Add Member"**

### Explore Features
- ✅ Search teams and members
- ✅ Click member names to view full profiles
- ✅ Edit team or member info with pencil icon
- ✅ Delete with trash icon (with confirmation)
- ✅ Responsive design (try on mobile)

## Step 6: Customize (Optional) 🎨

### Change Colors
Edit `src/index.css` CSS variables:
```css
:root {
  --primary: 217 91% 60%;      /* Change to your brand color */
  --accent: 0 84% 60%;         /* Change alert/delete color */
}
```

### Change App Title
Replace "Team Showcase" in `src/components/Layout.jsx`

### Add More Fields
Edit `src/pages/AddMember.jsx` and `src/pages/EditMember.jsx`

## Step 7: Deploy (Optional) 🌐

### Deploy to Vercel
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-showcase.git
git push -u origin main

# Deploy from Vercel dashboard
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Import your GitHub repo
# 4. Set environment variables in "Environment Variables" section:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 5. Deploy!
```

### Deploy to Other Platforms
1. Build: `pnpm build` (creates `dist` folder)
2. Upload `dist` to your hosting provider
3. Set environment variables in provider settings

## Troubleshooting 🔧

### "Configuration Required" message shows

**Solution**: Check that `.env.local` exists with both variables set:
```bash
# Check if file exists
cat .env.local

# Check values are not empty
grep VITE_SUPABASE .env.local
```

### Teams aren't showing up

**Possible causes**:
1. ❌ Database tables not created (re-run `schema.sql`)
2. ❌ Wrong Supabase URL/key
3. ❌ Browser console has errors (press F12, check Console tab)

**Solution**:
1. Verify `supabase/schema.sql` was fully executed
2. Double-check URL and key in `.env.local`
3. Open DevTools (F12) → Console tab for error messages

### Forms won't submit

**Possible causes**:
1. Missing required field (marked with *)
2. Supabase not responding
3. RLS policy issue

**Solution**:
1. Fill all fields marked with *
2. Check Supabase dashboard for any alerts
3. Check browser console for error details

### Can't connect to Supabase

**Possible causes**:
1. Project hasn't finished initializing (takes 1-2 minutes)
2. Wrong URL format
3. Internet connection issue

**Solution**:
1. Wait a few minutes if project is new
2. Copy URL directly from Supabase dashboard
3. Try in a different browser

## File Structure Reference

```
project-root/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app with routing
│   ├── store.js          # State management
│   ├── supabase.js       # Supabase config
│   └── index.css         # Global styles
├── supabase/
│   └── schema.sql        # Database schema
├── index.html            # HTML entry point
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind config
├── package.json          # Dependencies
├── .env.local            # Environment variables (create this)
├── README.md             # Full documentation
├── SETUP.md              # Detailed setup guide
├── DEVELOPER.md          # Developer guide
└── GETTING_STARTED.md    # This file!
```

## Next Steps 📚

- **Read** `README.md` for complete documentation
- **Read** `DEVELOPER.md` for architecture details
- **Explore** the code - it's well-commented
- **Customize** the app for your needs
- **Deploy** to production when ready

## API Limits

Supabase Free Tier includes:
- ✅ 500MB database
- ✅ 1GB bandwidth/month
- ✅ 100,000 monthly active users
- ✅ Unlimited API calls

For production apps needing more, upgrade to Supabase Pro.

## Support Resources

- 📖 [README.md](./README.md) - Full feature overview
- 👨‍💻 [DEVELOPER.md](./DEVELOPER.md) - Architecture & code guide
- 🔧 [SETUP.md](./SETUP.md) - Detailed setup reference
- 🌐 [Supabase Docs](https://supabase.com/docs)
- ⚛️ [React Docs](https://react.dev)
- ⚡ [Vite Docs](https://vitejs.dev)

---

**Questions?** Check the browser console (F12) for error messages - they'll guide you to the issue.

Happy building! 🎉
