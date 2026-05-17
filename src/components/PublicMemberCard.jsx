import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { api } from '../api'
import MemberAvatar from './MemberAvatar'

export default function PublicMemberCard({ member }) {
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      try {
        const count = await api.getApprovedCommentCount(member.id)
        setCommentCount(count)
      } catch (err) {
        console.error('[v0] Error loading comment count:', err)
      }
    }
    loadCount()
  }, [member.id])

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <Link to={`/members/${member.id}`} className="block">
        <MemberAvatar member={member} className="h-48 w-full" />
        <div className="border-b border-border bg-gradient-to-r from-accent/10 to-primary/10 px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
          {member.role && <p className="text-sm font-medium text-accent">{member.role}</p>}
        </div>
      </Link>

      <div className="space-y-4 p-6">
        {member.bio && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>
        )}

        <div className="space-y-2 text-sm">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-4 w-4" />
              {member.email}
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" />
              {member.phone}
            </a>
          )}
          {member.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
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
            <MessageCircle className="h-4 w-4" />
            Comments ({commentCount})
          </Link>
        </div>
      </div>
    </div>
  )
}
