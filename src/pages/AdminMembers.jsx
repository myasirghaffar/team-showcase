import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../api'
import AdminPageHeader from '../components/AdminPageHeader'
import MemberAvatar from '../components/MemberAvatar'
import MemberAvatarUpload from '../components/MemberAvatarUpload'
import { UI } from '../constants'

export default function AdminMembers() {
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    team_id: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeamId) {
      loadMembers(selectedTeamId)
    }
  }, [selectedTeamId])

  const loadTeams = async () => {
    try {
      const data = await api.getTeams()
      setTeams(data || [])
      if (data && data.length > 0) {
        setSelectedTeamId(data[0].id)
      }
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async (teamId) => {
    try {
      const data = await api.getMembers(teamId)
      setMembers(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (avatarUploading) {
      setError('Please wait for the image upload to finish.')
      return
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        avatar: formData.avatar,
        team_id: selectedTeamId,
      }
      if (editingId) {
        await api.updateMember(editingId, dataToSubmit)
      } else {
        await api.addMember(dataToSubmit)
      }
      setFormData({
        team_id: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: '',
      })
      setEditingId(null)
      setShowForm(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadMembers(selectedTeamId)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (member) => {
    setFormData({
      team_id: member.team_id || selectedTeamId,
      name: member.name || '',
      role: member.role || '',
      email: member.email || '',
      phone: member.phone || '',
      location: member.location || '',
      bio: member.bio || '',
      avatar: member.avatar || '',
    })
    setEditingId(member.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete this ${UI.criminalProfile.toLowerCase()}?`)) return
    try {
      await api.deleteMember(id)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadMembers(selectedTeamId)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setAvatarUploading(false)
    setFormData({
      team_id: '',
      name: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      avatar: '',
    })
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
        <AdminPageHeader
          title={`Manage ${UI.criminalProfiles}`}
          description="Upload and edit criminal dossiers with photos and case details"
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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12 p-6 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No categories available</p>
              <p className="text-sm text-muted-foreground">Create a crime category first before adding profiles</p>
            </div>
          ) : (
            <>
              {/* Team Selector */}
              <div className="mb-8">
                <label className="mb-3 block text-sm font-medium text-foreground">Select {UI.category}</label>
                <select
                  value={selectedTeamId || ''}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Form */}
              {showForm && (
                <div className="mb-8 p-6 bg-card border border-border rounded-lg">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {editingId ? `Edit ${UI.criminalProfile}` : `Add ${UI.criminalProfile}`}
                  </h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Full name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Suspect / convict name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">{UI.charges}</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="e.g., Serial murder, Armed robbery"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">{UI.lastKnownLocation}</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="City, Country"
                      />
                    </div>
                    <MemberAvatarUpload
                      value={formData.avatar}
                      memberName={formData.name}
                      memberId={editingId}
                      onChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))}
                      onError={setError}
                      onUploadingChange={setAvatarUploading}
                    />
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">{UI.caseSummary}</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Case details, conviction status, notable facts..."
                        rows="3"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={avatarUploading}
                        className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors disabled:opacity-50"
                      >
                        {editingId ? 'Update profile' : 'Add profile'}
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
                  Add criminal profile
                </button>
              )}

              {/* Members List */}
              {members.length === 0 ? (
                <div className="text-center py-12 p-6 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">No profiles in this category</p>
                  <p className="text-sm text-muted-foreground">Add your first criminal profile to get started</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="grid h-96 grid-rows-[7fr_3fr] overflow-hidden bg-card border border-border rounded-lg hover:border-accent transition-colors"
                    >
                      <div className="min-h-0 overflow-hidden">
                        <MemberAvatar
                          member={member}
                          objectPosition="top"
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex min-h-0 flex-col overflow-hidden p-3">
                        <div className="min-h-0 flex-1 overflow-hidden">
                          <h3 className="truncate text-sm font-bold text-foreground">{member.name}</h3>
                          {member.role && (
                            <p className="truncate text-xs font-semibold text-accent">{member.role}</p>
                          )}
                          {member.email && (
                            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                          )}
                          {member.location && (
                            <p className="truncate text-xs text-muted-foreground">{member.location}</p>
                          )}
                          {member.bio && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">{member.bio}</p>
                          )}
                        </div>
                        <div className="mt-2 flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-50 px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="flex flex-1 items-center justify-center gap-1 rounded bg-red-50 px-2 py-1.5 text-xs text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
    </main>
  )
}
