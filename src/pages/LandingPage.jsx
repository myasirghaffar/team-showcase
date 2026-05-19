import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import {
  Skull,
  FileWarning,
  Eye,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Search,
} from 'lucide-react'
import PublicMemberCard from '../components/PublicMemberCard'
import AppNavbar from '../components/AppNavbar'
import { APP_NAME, APP_TAGLINE, UI } from '../constants'
import { useAuthStore } from '../authStore'

export default function LandingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const teamsData = await api.getTeams()
        setTeams(teamsData || [])
        if (teamsData && teamsData.length > 0) {
          setSelectedTeam(teamsData[0])
          const membersData = await api.getMembers(teamsData[0].id)
          setMembers(membersData || [])
        }
      } catch (err) {
        console.error('[crime-dossier] Error fetching categories:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleCategorySelect = async (team) => {
    setSelectedTeam(team)
    try {
      const membersData = await api.getMembers(team.id)
      setMembers(membersData || [])
    } catch (err) {
      console.error('[crime-dossier] Error fetching criminals:', err)
    }
  }

  return (
    <div className="page-shell">
      <AppNavbar />

      <section className="horror-hero py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <Skull className="h-4 w-4" />
              <span>Public criminal archive</span>
            </div>
            <h1 className="horror-heading mb-6 text-balance text-5xl sm:text-7xl">
              Known {UI.criminals}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-balance text-xl text-muted-foreground">
              {APP_TAGLINE}. Browse official dossiers by crime category and submit reports with photo or video evidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="horror-btn inline-flex items-center gap-2"
              >
                Browse dossiers <ArrowRight className="h-5 w-5" />
              </button>
              {!user && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="horror-btn-outline"
                >
                  Sign in to report
                </button>
              )}
            </div>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
            <div className="horror-stat-card">
              <p className="text-3xl font-bold text-accent">{teams.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">{UI.categories}</p>
            </div>
            <div className="horror-stat-card">
              <p className="text-3xl font-bold text-accent">{members.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">Profiles listed</p>
            </div>
            <div className="horror-stat-card">
              <p className="text-3xl font-bold text-accent">Open</p>
              <p className="mt-1 text-sm text-muted-foreground">Evidence board</p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories-section" className="horror-categories-section py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="horror-heading mb-4 text-center text-3xl sm:text-4xl">
            Crime {UI.categories}
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Select a category — Murderer, Rapist, Serial Killer, and more — to view uploaded criminal profiles.
          </p>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading archive...</p>
            </div>
          ) : error ? (
            <div className="alert-error mx-auto max-w-lg text-center">
              <p className="font-medium">{error}</p>
              <p className="mt-1 text-sm opacity-90">
                Check your Supabase connection in .env.local and restart the dev server.
              </p>
            </div>
          ) : teams.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No categories published yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <div className="mb-12 flex flex-wrap justify-center gap-3">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleCategorySelect(team)}
                    className={
                      selectedTeam?.id === team.id
                        ? 'horror-category-chip horror-category-chip--active'
                        : 'horror-category-chip'
                    }
                  >
                    {team.name}
                  </button>
                ))}
              </div>

              {selectedTeam && (
                <div className="mb-12">
                  <div className="horror-category-panel mb-12">
                    <h3 className="horror-heading text-3xl">{selectedTeam.name}</h3>
                    {selectedTeam.department && (
                      <p className="mt-1 font-semibold text-accent">{selectedTeam.department}</p>
                    )}
                    {selectedTeam.description && (
                      <p className="mt-2 text-muted-foreground">{selectedTeam.description}</p>
                    )}
                  </div>

                  {members.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No criminal profiles in this category yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {members.map((member) => (
                        <PublicMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* <section className="horror-categories-section py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="horror-heading mb-12 text-center text-3xl sm:text-4xl">
            How the archive works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldAlert,
                title: 'Verified dossiers',
                description:
                  'Administrators upload criminal profiles with photos, charges, and case summaries for public review.',
              },
              {
                icon: Fingerprint,
                title: 'Categorized records',
                description:
                  'Profiles are grouped by crime type — murder, assault, fraud, and other classifications.',
              },
              {
                icon: FileWarning,
                title: 'Evidence reports',
                description:
                  'Signed-in users and anonymous visitors can post comments with images or video as supporting evidence.',
              },
            ].map((feature) => (
              <div key={feature.title} className="horror-card group p-8">
                <feature.icon className="mb-4 h-12 w-12 text-accent transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="horror-categories-section py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Eye className="mx-auto mb-4 h-10 w-10 text-accent" />
          <h2 className="horror-heading mb-6 text-3xl sm:text-4xl">Have information?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Open any criminal profile, leave a report, and attach photo or video evidence. Your tip may help others.
          </p>
          {!user && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="horror-btn inline-flex items-center gap-2"
            >
              Sign in to submit evidence <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8" style={{ backgroundColor: 'var(--card)' }}>
        <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground sm:px-6 lg:px-8">
          <p className="flex items-center justify-center gap-2 text-sm">
            <Search className="h-4 w-4 text-accent" />
            &copy; 2026 {APP_NAME}. For informational purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}
