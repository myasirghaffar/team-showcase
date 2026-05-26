import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Skull } from 'lucide-react'
import { UI } from '../constants'
import { api } from '../api'
import MemberAvatar from '../components/MemberAvatar'
import MemberCommentSection from '../components/MemberCommentSection'

export default function MemberDetail() {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getMember(memberId)
        if (!data) {
          setError(`${UI.criminalProfile} not found`)
          return
        }
        setMember(data)
      } catch (err) {
        setError(err.message || `Failed to load ${UI.criminalProfile.toLowerCase()}`)
      } finally {
        setLoading(false)
      }
    }

    if (memberId) loadMember()
  }, [memberId])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {loading ? (
          <p className="text-muted-foreground">Loading dossier...</p>
        ) : error ? (
          <div className="alert-error text-center">
            <p className="font-medium">{error}</p>
            <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
              Return to home
            </Link>
          </div>
        ) : (
          <>
            <article className="horror-card mb-8 overflow-hidden shadow-glow-sm">
              <MemberAvatar
                member={member}
                objectPosition="top"
                className="h-80 w-full sm:h-[26rem] md:h-[28rem]"
              />
              <div className="horror-card-header px-6 py-6 sm:px-8">
                <h1 className="horror-heading text-3xl">{member.name}</h1>
                {member.role && (
                  <p className="mt-1 text-lg font-medium text-accent">{member.role}</p>
                )}
                {member.teams?.name && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Skull className="h-4 w-4" />
                    {member.teams.name}
                    {member.teams.department && ` · ${member.teams.department}`}
                  </p>
                )}
              </div>

              <div className="horror-card-body space-y-6 sm:py-8">
                {member.bio && (
                  <p className="leading-relaxed">{member.bio}</p>
                )}

                <div className="space-y-3 text-sm">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {member.phone}
                    </a>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {member.location}
                    </div>
                  )}
                </div>
              </div>
            </article>

            <MemberCommentSection memberId={member.id} />
          </>
        )}
    </div>
  )
}
