import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../api'
import AdminSidebar from '../components/AdminSidebar'
import AdminPageHeader from '../components/AdminPageHeader'
import { CRIME_CATEGORIES, UI } from '../constants'

export default function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', department: '', description: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    setLoading(true)
    try {
      const data = await api.getTeams()
      setTeams(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await api.updateTeam(editingId, formData)
      } else {
        await api.addTeam(formData)
      }
      setFormData({ name: '', department: '', description: '' })
      setEditingId(null)
      setShowForm(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (team) => {
    setFormData(team)
    setEditingId(team.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete this ${UI.category.toLowerCase()}? All criminal profiles in it will be removed.`)) return
    try {
      await api.deleteTeam(id)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', department: '', description: '' })
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex h-screen min-w-0 flex-1 flex-col md:ml-64">
        <AdminPageHeader
          title={`Manage ${UI.categories}`}
          description="Create crime categories such as Murderer, Rapist, Serial Killer"
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Success</p>
                <p className="text-green-700 text-sm">Operation completed successfully</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Add Form */}
          {showForm && (
            <div className="mb-8 p-6 bg-card border border-border rounded-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingId ? `Edit ${UI.category}` : `Add ${UI.category}`}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {UI.category} name
                  </label>
                  <input
                    type="text"
                    name="name"
                    list="crime-category-suggestions"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="horror-input"
                    placeholder="e.g., Murderer, Rapist"
                  />
                  <datalist id="crime-category-suggestions">
                    {CRIME_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Classification (optional)
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="horror-input"
                    placeholder="e.g., Violent crime, Sexual offense"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Brief notes about this category..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors"
                  >
                    {editingId ? `Update ${UI.category}` : `Create ${UI.category}`}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-input rounded-lg hover:bg-accent/10 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add {UI.category}
            </button>
          )}

          {/* Teams List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12 p-6 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <p className="text-sm text-muted-foreground">Create your first crime category to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <div key={team.id} className="p-6 bg-card border border-border rounded-lg hover:border-accent transition-colors">
                  <h3 className="text-lg font-bold text-foreground mb-1">{team.name}</h3>
                  {team.department && (
                    <p className="text-sm text-accent font-semibold mb-2">{team.department}</p>
                  )}
                  {team.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="flex flex-1 items-center justify-center gap-2 rounded bg-accent/15 px-3 py-2 text-accent transition-colors hover:bg-accent/25"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded bg-red-950/50 px-3 py-2 text-red-400 transition-colors hover:bg-red-950/80"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
