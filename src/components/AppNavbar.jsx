import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Skull, User } from 'lucide-react'
import { useAuthStore } from '../authStore'
import { APP_LOGO_LETTER, APP_NAME } from '../constants'

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
    <nav className="horror-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 bg-accent/20 font-display text-lg font-bold text-accent">
            {APP_LOGO_LETTER}
          </div>
          <span className="font-display text-xl tracking-wide text-white">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/blog"
            className="hidden text-sm font-medium text-white/90 transition-colors hover:text-white sm:inline-block"
          >
            Articles
          </Link>
          {user ? (
            <>
              <Link
                to="/account"
                title="My account"
                aria-label={`My account (${user.fullName})`}
                aria-current={isAccountPage ? 'page' : undefined}
                className={`flex max-w-[11rem] items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-white transition-colors sm:max-w-xs ${
                  isAccountPage
                    ? 'bg-accent/15 ring-2 ring-accent ring-offset-2 ring-offset-background'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isAccountPage
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-accent/15 text-accent'
                  }`}
                >
                  <User className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-medium text-white">{user.fullName}</span>
              </Link>
              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => navigate('/admin/teams')}
                  className="horror-btn flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <Skull className="h-4 w-4" />
                  Admin
                </button>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="horror-btn-outline px-4 py-2 text-sm"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="horror-btn hidden px-4 py-2 text-sm sm:inline-flex"
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
