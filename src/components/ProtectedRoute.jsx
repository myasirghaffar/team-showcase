import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../authStore'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, initialized, loading } = useAuthStore()
  const location = useLocation()

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
