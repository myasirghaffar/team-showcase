import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTeamStore } from '../store'
import { ArrowLeft } from 'lucide-react'

function EditMember() {
  const navigate = useNavigate()
  const { id } = useParams()
  const members = useTeamStore((state) => state.members)
  const selectedTeam = useTeamStore((state) => state.selectedTeam)
  const updateMember = useTeamStore((state) => state.updateMember)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
  })

  useEffect(() => {
    const member = members.find((m) => m.id === id)
    if (member) {
      setFormData({
        name: member.name,
        role: member.role || '',
        email: member.email || '',
        phone: member.phone || '',
        location: member.location || '',
        bio: member.bio || '',
        avatar: member.avatar || '',
      })
    } else {
      navigate('/')
    }
  }, [id, members, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Member name is required')
      return
    }

    setLoading(true)
    try {
      await updateMember(id, formData)
      navigate(`/member/${id}`)
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Failed to update member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/member/${id}`)}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Member
      </button>

      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground mb-8">Edit Member</h2>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Senior Developer"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-semibold text-foreground mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="New York, NY"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="avatar" className="block text-sm font-semibold text-foreground mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="bio" className="block text-sm font-semibold text-foreground mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about this team member..."
              rows="4"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/member/${id}`)}
              className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMember
