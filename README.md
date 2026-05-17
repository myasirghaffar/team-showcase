# Team Showcase App

A beautiful, modern team management and showcase application built with React, Vite, and Supabase. Perfect for displaying team members, managing team information, and creating an engaging team directory.

## Features

✨ **Team Management**
- Browse all teams in a responsive grid layout
- View detailed team information with descriptions
- Add, edit, and delete teams easily
- Search teams by name or department

👥 **Member Management**
- Manage team members with detailed profiles
- Store member information: email, phone, location, bio, avatar
- Quick member preview cards
- Search members by name or role

🔍 **Search & Discovery**
- Real-time search for teams and members
- Filter by team name, department, role
- Organized, intuitive interface

📱 **Responsive Design**
- Mobile-first design approach
- Looks great on all screen sizes
- Touch-friendly interface

⚡ **Performance**
- Built with Vite for lightning-fast development
- Optimized bundle with React Router and Zustand
- Supabase for instant backend setup

## Technology Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: JavaScript (no TypeScript overhead)

## Quick Start

### 1. Installation

```bash
# Install dependencies
pnpm install
```

### 2. Configure Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor and paste the contents of `supabase/schema.sql`
4. Execute the SQL to set up tables and RLS policies

### 3. Set Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Get these values from your Supabase project settings → API.

### 4. Start Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout.jsx          # Header, footer, navigation
│   ├── TeamCard.jsx        # Team display card
│   ├── TeamMemberCard.jsx  # Member display card
│   └── SearchBar.jsx       # Search input component
│
├── pages/                   # Route components
│   ├── Home.jsx            # Teams list and search
│   ├── TeamPage.jsx        # Team details & members
│   ├── MemberDetail.jsx    # Individual member profile
│   ├── AddTeam.jsx         # Create new team
│   ├── AddMember.jsx       # Add member to team
│   ├── EditTeam.jsx        # Edit team info
│   └── EditMember.jsx      # Edit member info
│
├── App.jsx                  # Main app with routing
├── store.js                 # Zustand state management
├── supabase.js             # Supabase client config
├── main.jsx                # React entry point
└── index.css               # Tailwind styles

supabase/
└── schema.sql              # Database schema and RLS policies

```

## Usage

### Creating a Team

1. Click the **"+ New Team"** button in the header
2. Fill in team name (required), department, and description
3. Click **"Create Team"**

### Adding Team Members

1. Navigate to a team detail page
2. Click **"+ Add Member"**
3. Enter member information:
   - Name (required)
   - Role (e.g., "Senior Developer")
   - Email, Phone, Location
   - Avatar URL (optional)
   - Bio/Description
4. Click **"Add Member"**

### Searching

- Use the search bar on the Teams page to filter teams
- Use the search bar on Team pages to filter members
- Search matches names, roles, departments

### Editing & Deleting

- Hover over any team or member card
- Click the **edit icon** (pencil) to modify
- Click the **delete icon** (trash) to remove
- Delete actions require confirmation

## Database Schema

### teams table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Required, team name |
| department | TEXT | Optional department |
| description | TEXT | Team description |
| member_count | INT | Number of members |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

### team_members table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| team_id | UUID | Foreign key to teams |
| name | TEXT | Required, member name |
| role | TEXT | Job title |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| location | TEXT | City/Location |
| bio | TEXT | Biography |
| avatar | TEXT | Image URL |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

## Styling

The app uses Tailwind CSS with a clean, professional color scheme:

- **Primary**: Blue (`#3b82f6`) - Main brand color
- **Secondary**: Gray (`#f3f4f6`) - Backgrounds
- **Accent**: Red (`#ef4444`) - Alerts/Destructive actions
- **Foreground**: Black/Dark Gray - Text
- **Background**: White - Default background
- **Border**: Light Gray - Dividers and borders
- **Muted**: Medium Gray - Secondary text

Colors are defined as CSS variables in `src/index.css` for easy customization.

## Scripts

```bash
# Development
pnpm dev          # Start dev server with HMR

# Production
pnpm build        # Build for production
pnpm preview      # Preview production build locally

# Quality
pnpm lint         # Run ESLint
```

## Customization

### Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary: 217 91% 60%;
  --accent: 0 84% 60%;
  /* ... */
}
```

### Branding

- Logo/Icon: Update in `components/Layout.jsx`
- App Title: Search and replace "Team Showcase"
- Colors: Update `tailwind.config.js` and `src/index.css`

### Form Fields

Extend the `AddMember.jsx` and `AddTeam.jsx` forms to add custom fields.

## Row Level Security (RLS)

The database uses RLS policies for security. The default schema allows public read/write access for demonstration. For production:

1. Enable authentication in Supabase
2. Update RLS policies to require user authentication
3. Add user_id columns to track who created data

Example:
```sql
CREATE POLICY "Users can only edit their own teams"
  ON teams
  FOR UPDATE
  USING (auth.uid() = user_id);
```

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
# Set environment variables in Vercel project settings
```

### Deploy to Other Platforms

1. Build the project: `pnpm build`
2. Deploy the `dist` folder
3. Set environment variables in platform settings

## Troubleshooting

### "Supabase not configured" message

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`

### Forms not saving data

Check that:
1. Supabase credentials are correct
2. Database tables were created from `supabase/schema.sql`
3. RLS policies allow operations (check browser console for errors)

### Search not working

Ensure you've entered full team/member names. Search is case-insensitive substring matching.

### Page not loading

Check browser console (F12) for errors. Most issues are:
1. Missing environment variables
2. Incorrect Supabase URL/key
3. Database not set up

## Best Practices

- **Images**: Use Supabase Storage for team photos and avatars
- **Scale**: RLS policies ensure data isolation when adding authentication
- **Backups**: Use Supabase's automatic daily backups
- **Performance**: Leverage Supabase's indexes for fast searches

## Future Enhancements

- User authentication (Supabase Auth)
- Image upload (Supabase Storage)
- Dark mode toggle
- Export team directory as PDF
- Email invitations for team members
- Team activity feed/changelog
- Advanced filtering and sorting

## Support

For issues, feature requests, or questions:

1. Check the `SETUP.md` for detailed configuration help
2. Review browser console for error messages
3. Check Supabase dashboard for database issues

## License

MIT - Feel free to use this project for personal or commercial purposes.

---

Built with ❤️ for team collaboration and transparency
