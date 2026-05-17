import { Link } from 'react-router-dom'
import { Users, Edit2, Trash2 } from 'lucide-react'

function TeamCard({ team, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Link
              to={`/team/${team.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              {team.name}
            </Link>
            <p className="text-sm text-muted-foreground">{team.department || 'No department'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(team)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-secondary rounded"
            aria-label="Edit team"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(team.id)}
            className="p-2 text-muted-foreground hover:text-accent transition-colors hover:bg-secondary rounded"
            aria-label="Delete team"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{team.description || 'No description'}</p>
      <div className="text-xs text-muted-foreground">
        {team.member_count || 0} members
      </div>
    </div>
  )
}

export default TeamCard
