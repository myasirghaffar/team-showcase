import { useState, useEffect } from 'react'
import { Search, MessageCircle, Users, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import TeamCard from '../components/TeamCard'
import PublicMemberCard from '../components/PublicMemberCard'

export default function Landing() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam) {
      loadMembers(selectedTeam.id)
    }
  }, [selectedTeam])

  const loadTeams = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getTeams()
      setTeams(data || [])
      if (data && data.length > 0) {
        setSelectedTeam(data[0])
      }
    } catch (err) {
      console.error('[v0] Error loading teams:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async (teamId) => {
    try {
      const data = await api.getMembers(teamId)
      setMembers(data || [])
    } catch (err) {
      console.error('[v0] Error loading members:', err)
      setMembers([])
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-4">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Meet Our Team</span>
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-4">
                Amazing People, Amazing Work
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover the talented individuals behind our success. Connect with our team members, leave feedback, and be part of our growing community.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/teams')}
              className="flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors whitespace-nowrap"
            >
              <Settings className="h-5 w-5" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {loading && !teams.length ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="mt-4 text-muted-foreground">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No teams available yet</p>
          </div>
        ) : (
          <>
            {/* Teams Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Teams</h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTeam?.id === team.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    {team.department && (
                      <p className="text-sm text-muted-foreground">{team.department}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members */}
            {selectedTeam && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedTeam.name} Team</h2>
                  {selectedTeam.description && (
                    <p className="text-muted-foreground">{selectedTeam.description}</p>
                  )}
                </div>

                {filteredMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No team members found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                      <PublicMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
