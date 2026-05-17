import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { useAuthStore } from '../authStore'

export default function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const goToLogin = () => {
    navigate('/login', {
      state: { from: location.pathname + location.search },
    })
  }

  const isAccountPage = location.pathname === '/account'

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground">
            T
          </div>
          <span className="text-xl font-bold text-foreground">Team Showcase</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link
                to="/account"
                title="My profile"
                aria-label="My profile"
                aria-current={isAccountPage ? 'page' : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  isAccountPage
                    ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background'
                    : 'text-foreground hover:bg-accent/10'
                }`}
              >
                <User className="h-5 w-5" />
              </Link>
              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => navigate('/admin/teams')}
                  className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Admin Panel
                </button>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="rounded-lg border border-accent px-4 py-2 text-accent transition-colors hover:bg-accent/10"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
