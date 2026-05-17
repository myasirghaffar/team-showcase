import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeamStore } from '../store'
import TeamCard from '../components/TeamCard'
import SearchBar from '../components/SearchBar'

function Home() {
  const navigate = useNavigate()
  const teams = useTeamStore((state) => state.teams)
  const error = useTeamStore((state) => state.error)
  const deleteTeam = useTeamStore((state) => state.deleteTeam)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.department && team.department.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleEdit = (team) => {
    navigate(`/team/${team.id}/edit`)
  }

  const handleDelete = (teamId) => {
    if (confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Teams</h2>
        <p className="text-muted-foreground">Browse all teams and their members</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-accent/10 border border-accent rounded-lg">
          <p className="text-accent font-medium mb-2">Configuration Required</p>
          <p className="text-sm text-foreground mb-3">{error}</p>
          <p className="text-xs text-muted-foreground">
            Visit the <code className="bg-white px-2 py-1 rounded">SETUP.md</code> file for detailed setup instructions.
          </p>
        </div>
      )}

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search teams..."
        />
      </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {teams.length === 0 ? 'No teams yet' : 'No teams match your search'}
          </p>
          {teams.length === 0 && !error && (
            <button
              onClick={() => navigate('/team/add')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Create your first team
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
