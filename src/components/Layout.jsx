import { Link, useLocation } from 'react-router-dom'
import { Users } from 'lucide-react'

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Team Showcase</h1>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Teams
            </Link>
            <Link
              to="/team/add"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              + New Team
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-secondary/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Team Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
