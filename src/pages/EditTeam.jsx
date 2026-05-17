import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTeamStore } from '../store'
import { ArrowLeft } from 'lucide-react'

function EditTeam() {
  const navigate = useNavigate()
  const { id } = useParams()
  const teams = useTeamStore((state) => state.teams)
  const updateTeam = useTeamStore((state) => state.updateTeam)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    description: '',
  })

  useEffect(() => {
    const team = teams.find((t) => t.id === id)
    if (team) {
      setFormData({
        name: team.name,
        department: team.department || '',
        description: team.description || '',
      })
    } else {
      navigate('/')
    }
  }, [id, teams, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Team name is required')
      return
    }

    setLoading(true)
    try {
      await updateTeam(id, formData)
      navigate(`/team/${id}`)
    } catch (error) {
      console.error('Error updating team:', error)
      alert('Failed to update team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/team/${id}`)}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Team
      </button>

      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground mb-8">Edit Team</h2>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Team Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Engineering"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="department" className="block text-sm font-semibold text-foreground mb-2">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Technology"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this team..."
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
              onClick={() => navigate(`/team/${id}`)}
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

export default EditTeam
