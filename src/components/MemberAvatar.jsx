import { useState } from 'react'
import { User } from 'lucide-react'
import { getMemberAvatarUrl } from '../utils/memberAvatar'

export default function MemberAvatar({
  member,
  className = '',
  imageClassName = '',
  objectPosition = 'center',
}) {
  const positionClass =
    objectPosition === 'top'
      ? 'object-top'
      : objectPosition === 'bottom'
        ? 'object-bottom'
        : 'object-center'
  const [failed, setFailed] = useState(false)
  const src = getMemberAvatarUrl(member)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-accent/10 text-accent ${className}`}
        aria-hidden
      >
        <User className={`opacity-70 ${imageClassName || 'h-10 w-10'}`} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={member?.name ? `${member.name} — criminal dossier` : 'Criminal profile'}
      className={`object-cover ${positionClass} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
