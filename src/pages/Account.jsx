import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../authStore'
import { LogOut, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function Account() {
  const navigate = useNavigate()
  const { user, initialized, loading: authLoading, logout, updateProfile, error, clearError } =
    useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
  })

  if (!initialized || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    setSuccess(false)

    try {
      await updateProfile({
        fullName: formData.fullName,
        bio: formData.bio,
      })
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('[v0] Update failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
       

        {success && (
          <div className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Success</p>
              <p className="text-sm text-green-700">Your profile has been updated successfully</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user.fullName}</h2>
                <p className="text-muted-foreground">
                  {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-lg bg-accent/10 p-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="flex-1 bg-transparent text-foreground outline-none disabled:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-accent/10 disabled:text-muted-foreground"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-accent/10 disabled:text-muted-foreground"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Account Type</p>
                <p className="text-lg font-semibold capitalize text-foreground">{user.role}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 sm:flex-row">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 rounded-lg bg-accent py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-accent py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        fullName: user.fullName,
                        bio: user.bio,
                      })
                    }}
                    className="rounded-lg border border-input px-6 py-2 font-medium transition-colors hover:bg-accent/10"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-lg border border-input px-6 py-2 font-medium text-foreground transition-colors hover:bg-accent/10 sm:flex-none"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </form>
        </div>
    </div>
  )
}
