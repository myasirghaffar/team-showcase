import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileWarning, Mail, Phone, MapPin } from 'lucide-react'
import { UI } from '../constants'
import { api } from '../api'
import MemberAvatar from './MemberAvatar'

export default function PublicMemberCard({ member }) {
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      try {
        const count = await api.getCommentCount(member.id)
        setCommentCount(count)
      } catch (err) {
        console.error('[crime-dossier] Error loading comment count:', err)
      }
    }
    loadCount()
  }, [member.id])

  return (
    <div className="horror-card overflow-hidden">
      <Link to={`/members/${member.id}`} className="block">
        <MemberAvatar
          member={member}
          objectPosition="top"
          className="h-56 w-full sm:h-64"
        />
        <div className="horror-card-header">
          <h3 className="text-lg font-semibold">{member.name}</h3>
          {member.role && <p className="text-sm font-medium text-accent">{member.role}</p>}
        </div>
      </Link>

      <div className="horror-card-body space-y-4">
        {member.bio && (
          <p className="line-clamp-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {member.bio}
          </p>
        )}

        <div className="space-y-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 transition-colors hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-4 w-4" />
              {member.email}
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 transition-colors hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" />
              {member.phone}
            </a>
          )}
          {member.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {member.location}
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <Link
            to={`/members/${member.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            <FileWarning className="h-4 w-4" />
            {UI.reports} ({commentCount})
          </Link>
        </div>
      </div>
    </div>
  )
}
