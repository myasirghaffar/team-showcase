# Team Showcase App - Setup Guide

This is a React + Vite + JavaScript team showcase application with Zustand state management and Supabase integration.

## Prerequisites

- Node.js 16+ and pnpm
- A Supabase account (free tier works great)

## Project Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to your project's SQL Editor
3. Copy the contents of `supabase/schema.sql` into the SQL Editor
4. Run the SQL to create the tables and RLS policies

### 3. Set Environment Variables

1. Copy your Supabase project URL and anonymous key from the project settings
2. Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── TeamCard.jsx    # Team card component
│   ├── TeamMemberCard.jsx # Member card component
│   └── SearchBar.jsx   # Search component
├── pages/              # Page components (routes)
│   ├── Home.jsx        # Teams list page
│   ├── TeamPage.jsx    # Team details page
│   ├── MemberDetail.jsx # Member details page
│   ├── AddTeam.jsx     # Add team form
│   ├── AddMember.jsx   # Add member form
│   ├── EditTeam.jsx    # Edit team form
│   └── EditMember.jsx  # Edit member form
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
├── store.js            # Zustand state management
├── supabase.js         # Supabase client configuration
└── index.css           # Tailwind CSS styles
```

## Features

- **Browse Teams**: View all teams in a responsive grid
- **Team Details**: Click on a team to see all members
- **Member Profiles**: View detailed member information
- **Search**: Search teams and members by name or role
- **Create/Edit**: Add and modify teams and members
- **Delete**: Remove teams and members with confirmation
- **Real-time Sync**: Zustand store syncs with Supabase

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Technologies Used

- **React 19** - UI library
- **Vite 5** - Build tool
- **React Router** - Client-side routing
- **Zustand** - State management
- **Supabase** - Backend & database
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

## Database Schema

### teams table
- `id` - UUID primary key
- `name` - Team name (required)
- `department` - Department name
- `description` - Team description
- `member_count` - Number of members
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### team_members table
- `id` - UUID primary key
- `team_id` - Foreign key to teams
- `name` - Member name (required)
- `role` - Job role
- `email` - Email address
- `phone` - Phone number
- `location` - Location/city
- `bio` - Short biography
- `avatar` - Avatar image URL
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Styling

The app uses Tailwind CSS with a custom color scheme defined in `tailwind.config.js`. The colors use CSS custom properties (variables) for easy customization:

- `--background` - Background color
- `--foreground` - Text color
- `--primary` - Primary brand color
- `--secondary` - Secondary/muted color
- `--accent` - Accent/error color
- `--border` - Border color
- `--muted` - Muted text color

## Notes

- The RLS (Row Level Security) policies allow public read/write access for demonstration. For production, implement proper authentication and more restrictive policies.
- Avatar URLs can be any image URL or Supabase Storage URLs
- The app uses client-side routing with React Router for smooth navigation

## License

MIT
