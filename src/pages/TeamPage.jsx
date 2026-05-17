import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTeamStore } from '../store'
import TeamMemberCard from '../components/TeamMemberCard'
import SearchBar from '../components/SearchBar'
import { ArrowLeft } from 'lucide-react'

function TeamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const selectedTeam = useTeamStore((state) => state.selectedTeam)
  const members = useTeamStore((state) => state.members)
  const setSelectedTeam = useTeamStore((state) => state.setSelectedTeam)
  const fetchMembers = useTeamStore((state) => state.fetchMembers)
  const deleteMember = useTeamStore((state) => state.deleteMember)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const team = useTeamStore.getState().teams.find((t) => t.id === id)
    if (team) {
      setSelectedTeam(team)
      fetchMembers(id)
    }
  }, [id])

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleEditMember = (member) => {
    navigate(`/member/${member.id}/edit`)
  }

  const handleDeleteMember = (memberId) => {
    if (confirm('Are you sure you want to delete this member?')) {
      deleteMember(memberId)
    }
  }

  if (!selectedTeam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Team not found</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary/80 transition-colors font-medium mt-4"
        >
          Back to teams
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Teams
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">{selectedTeam.name}</h2>
        {selectedTeam.department && (
          <p className="text-lg text-primary mb-2">{selectedTeam.department}</p>
        )}
        {selectedTeam.description && (
          <p className="text-muted-foreground mb-4">{selectedTeam.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Members ({filteredMembers.length})
        </h3>
        <button
          onClick={() => navigate(`/member/add/${id}`)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          + Add Member
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search members..."
        />
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {members.length === 0 ? 'No members yet' : 'No members match your search'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamPage
