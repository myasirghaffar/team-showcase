# Developer Guide

## Architecture Overview

This is a full-stack React application with the following architecture:

```
┌─────────────────────────────────────────┐
│         React SPA (Vite)                │
│  ┌─────────────────────────────────┐   │
│  │     React Components (JSX)      │   │
│  │  ┌────────┐  ┌──────────────┐   │   │
│  │  │ Layout │  │ Pages/Routes │   │   │
│  │  └────────┘  └──────────────┘   │   │
│  └─────────────────────────────────┘   │
│              ↓ (uses)                   │
│  ┌─────────────────────────────────┐   │
│  │   Zustand State Store (store.js) │   │
│  │  - Teams                        │   │
│  │  - Members                      │   │
│  │  - Search state                 │   │
│  └─────────────────────────────────┘   │
│              ↓ (calls)                  │
│  ┌─────────────────────────────────┐   │
│  │  Supabase Client (supabase.js)  │   │
│  │  - REST API calls               │   │
│  │  - Real-time subscriptions      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
            ↓ (HTTP)
┌─────────────────────────────────────────┐
│     Supabase Backend                    │
│  ┌─────────────────────────────────┐   │
│  │   PostgreSQL Database           │   │
│  │  - teams table                  │   │
│  │  - team_members table           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   Row Level Security (RLS)      │   │
│  │  - Access control               │   │
│  │  - Data isolation               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## State Management with Zustand

The app uses Zustand for global state management. The store (`src/store.js`) manages:

### State Structure
```javascript
{
  // Data
  teams: [],                    // Array of team objects
  members: [],                  // Array of member objects
  
  // UI State
  selectedTeam: null,           // Currently selected team
  selectedMember: null,         // Currently selected member
  searchQuery: '',              // Search input
  
  // Status
  loading: false,               // API call loading state
  error: null,                  // Error message
}
```

### Store Actions

```javascript
// Query actions
fetchTeams()                    // Load all teams from DB
fetchMembers(teamId)            // Load members for a team

// Create actions
addTeam(teamData)               // Create new team
addMember(memberData)           // Create new member

// Update actions
updateTeam(teamId, updates)     // Edit team
updateMember(memberId, updates) // Edit member

// Delete actions
deleteTeam(teamId)              // Remove team
deleteMember(memberId)          // Remove member

// UI actions
setSelectedTeam(team)           // Select team
setSelectedMember(member)       // Select member
setSearchQuery(query)           // Update search
setLoading(bool)                // Loading state
setError(msg)                   // Error state
```

### Using the Store in Components

```javascript
import { useTeamStore } from '../store'

function MyComponent() {
  // Get state
  const teams = useTeamStore((state) => state.teams)
  const loading = useTeamStore((state) => state.loading)
  
  // Get actions
  const fetchTeams = useTeamStore((state) => state.fetchTeams)
  const addTeam = useTeamStore((state) => state.addTeam)
  
  // Use in component
  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])
  
  return <div>{/* ... */}</div>
}
```

## Routing

The app uses React Router v7 for client-side routing:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.jsx | Teams list and search |
| `/team/:id` | TeamPage.jsx | Team details & members |
| `/team/add` | AddTeam.jsx | Create new team |
| `/team/:id/edit` | EditTeam.jsx | Edit team |
| `/member/:id` | MemberDetail.jsx | Member profile |
| `/member/add/:teamId` | AddMember.jsx | Add team member |
| `/member/:id/edit` | EditMember.jsx | Edit member |

## Component Hierarchy

```
Layout (root layout with header/footer)
├── Home
│   ├── SearchBar
│   └── TeamCard (map)
│       ├── Edit button → EditTeam
│       └── Delete button
├── TeamPage
│   ├── SearchBar
│   └── TeamMemberCard (map)
│       ├── Edit button → EditMember
│       └── Delete button
├── MemberDetail
├── AddTeam
│   └── Form inputs
├── EditTeam
│   └── Form inputs (pre-filled)
├── AddMember
│   └── Form inputs
└── EditMember
    └── Form inputs (pre-filled)
```

## Form Handling

All forms follow the same pattern:

```javascript
const [formData, setFormData] = useState({ /* initial state */ })
const [loading, setLoading] = useState(false)

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!formData.name?.trim()) {
    alert('Required field missing')
    return
  }
  
  setLoading(true)
  try {
    await addTeam(formData)  // or updateTeam, addMember, etc.
    navigate('/success-path')
  } catch (error) {
    alert('Error: ' + error.message)
  } finally {
    setLoading(false)
  }
}
```

## API Integration with Supabase

The Supabase client is initialized in `src/supabase.js`:

```javascript
import { supabase } from '../supabase'

// Select data
const { data, error } = await supabase
  .from('teams')
  .select('*')
  .order('created_at', { ascending: false })

// Insert data
const { data, error } = await supabase
  .from('teams')
  .insert([{ name: 'Engineering', description: '...' }])
  .select()

// Update data
const { data, error } = await supabase
  .from('teams')
  .update({ name: 'Updated Name' })
  .eq('id', teamId)
  .select()

// Delete data
const { error } = await supabase
  .from('teams')
  .delete()
  .eq('id', teamId)
```

## Styling with Tailwind CSS

The app uses Tailwind CSS with custom design tokens:

```javascript
// Color tokens (defined in index.css)
bg-background              // White background
text-foreground            // Dark text
bg-primary                 // Blue backgrounds
text-primary              // Blue text
bg-secondary              // Gray backgrounds
border border-border       // Borders

// Common patterns
<div className="flex items-center gap-4">  // Flexbox with spacing
<div className="grid grid-cols-3 gap-6">   // Grid layout
<div className="text-sm text-muted-foreground">  // Muted text

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">  // Responsive grid
<div className="px-4 md:px-8">                                   // Responsive padding
```

## Error Handling

All async operations follow this pattern:

```javascript
try {
  // Attempt operation
  const result = await supabase.from('teams').select()
  
  // Check for Supabase error
  if (error) throw error
  
  // Update state
  set({ data: result })
} catch (error) {
  // Handle error
  console.error('Operation failed:', error.message)
  set({ error: error.message })
  
  // User feedback (optional)
  alert('Operation failed: ' + error.message)
} finally {
  // Always cleanup
  set({ loading: false })
}
```

## Adding New Features

### Adding a new table

1. **Update database schema**
   ```sql
   -- Add to supabase/schema.sql
   CREATE TABLE new_table (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     -- ... columns
   );
   
   -- Add RLS policies
   ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "..." ON new_table ...;
   ```

2. **Update store** (`src/store.js`)
   ```javascript
   export const useTeamStore = create((set) => ({
     // Add to state
     newTableData: [],
     
     // Add to actions
     fetchNewTable: async () => { /* ... */ },
     addNewItem: async (data) => { /* ... */ },
   }))
   ```

3. **Add component** (`src/components/NewComponent.jsx`)
   ```javascript
   import { useTeamStore } from '../store'
   
   export default function NewComponent() {
     const data = useTeamStore(state => state.newTableData)
     // ...
   }
   ```

### Adding a new page

1. **Create page component** (`src/pages/NewPage.jsx`)
2. **Add route** in `src/App.jsx`
   ```javascript
   <Route path="/new-path" element={<NewPage />} />
   ```
3. **Add navigation link** in `src/components/Layout.jsx`

## Testing Locally

```bash
# Start dev server
pnpm dev

# Build for production test
pnpm build
pnpm preview

# Check for linting issues
pnpm lint
```

## Common Debugging

### Store not updating
- Check that component is subscribed: `useTeamStore(state => state.property)`
- Verify async action completed successfully
- Check browser DevTools for errors

### API calls failing
- Check Supabase URL and key in `.env.local`
- Verify RLS policies allow operation
- Check database tables exist and match query

### Form not submitting
- Verify all required fields have values
- Check browser console for validation errors
- Ensure loading state isn't stuck

### Styling issues
- Check Tailwind classes are spelled correctly
- Verify color tokens are defined in `index.css`
- Use browser DevTools to inspect final styles

## Performance Tips

1. **Component memoization** - Use `useMemo` for expensive computations
2. **Lazy loading** - Use React Router lazy for code splitting
3. **Query optimization** - Only select needed columns in Supabase queries
4. **Debouncing** - Debounce search input to reduce API calls
5. **Caching** - Zustand provides built-in state caching

## Security Considerations

1. **RLS Policies** - All data access controlled by Supabase RLS
2. **No secrets in code** - API key is public (anon key), use RLS for security
3. **Input validation** - Validate before sending to API
4. **CORS** - Supabase handles CORS automatically
5. **Deployment** - Keep `.env.local` out of version control

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
