import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../authStore'
import { AlertCircle, CheckCircle, Eye, EyeOff, Skull } from 'lucide-react'
import { APP_NAME } from '../constants'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => location.state?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(() => location.state?.message || null)
  const { login, error, clearError } = useAuthStore()

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state?.message, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setSuccessMessage(null)
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user?.role === 'admin') {
        navigate('/admin/teams', { replace: true })
        return
      }
      const from = location.state?.from
      const returnTo =
        from && !['/login', '/signup'].includes(from) ? from : '/'
      navigate(returnTo, { replace: true })
    } catch (err) {
      console.error('[auth] Login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-accent/40 bg-accent/20">
            <Skull className="h-6 w-6 text-accent" />
          </div>
          <h1 className="horror-heading text-3xl">Enter the archive</h1>
          <p className="mt-2 text-muted-foreground">Sign in to {APP_NAME} to submit evidence reports</p>
        </div>

        {successMessage && (
          <div className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-medium text-green-800">You&apos;re almost in!</p>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Login Failed</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="horror-card rounded-xl p-8 shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 font-medium transition-colors mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* <div className="mt-8 p-6 bg-accent/10/50 border border-border rounded-lg text-sm">
          <h3 className="font-semibold text-foreground mb-3">Test accounts</h3>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Admin:</span> admin@teamshowcase.dev / admin123
            </p>
            <p>
              <span className="font-medium text-foreground">User:</span> user@teamshowcase.dev / user123
            </p>
          </div>
        </div> */}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
