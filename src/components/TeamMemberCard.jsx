import { Link } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import MemberAvatar from './MemberAvatar'

function TeamMemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link
          to={`/member/${member.id}`}
          className="flex-1"
        >
          <div className="flex items-center gap-3">
            <MemberAvatar
              member={member}
              className="h-10 w-10 shrink-0 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-primary">{member.role}</p>
            </div>
          </div>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-secondary rounded"
            aria-label="Edit member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-2 text-muted-foreground hover:text-accent transition-colors hover:bg-secondary rounded"
            aria-label="Delete member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {member.email && (
        <p className="text-xs text-muted-foreground">{member.email}</p>
      )}
    </div>
  )
}

export default TeamMemberCard
