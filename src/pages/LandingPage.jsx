import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Users, MessageCircle, Star, ArrowRight, Briefcase, Target, Zap } from 'lucide-react'
import PublicMemberCard from '../components/PublicMemberCard'
import AppNavbar from '../components/AppNavbar'
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
    const fetchTeams = async () => {
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
        console.error('[v0] Error fetching teams:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const handleTeamSelect = async (team) => {
    setSelectedTeam(team)
    try {
      const membersData = await api.getMembers(team.id)
      setMembers(membersData || [])
    } catch (err) {
      console.error('[v0] Error fetching members:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />


      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/5 to-background py-20 sm:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
              Meet Our Amazing Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Discover the talented individuals who make our success possible. Connect, collaborate, and celebrate our team members.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => document.getElementById('teams-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-semibold transition-colors flex items-center gap-2"
              >
                Explore Teams <ArrowRight className="h-5 w-5" />
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 font-semibold transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <p className="text-3xl font-bold text-accent">{teams.length}</p>
              <p className="text-muted-foreground text-sm mt-1">Teams</p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <p className="text-3xl font-bold text-accent">{members.length}</p>
              <p className="text-muted-foreground text-sm mt-1">Members</p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <p className="text-3xl font-bold text-accent">100%</p>
              <p className="text-muted-foreground text-sm mt-1">Talented</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">Why Our Team Stands Out</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Innovation',
                description: 'We push boundaries and embrace new ideas to stay ahead of the curve.',
              },
              {
                icon: Target,
                title: 'Excellence',
                description: 'Every team member is committed to delivering their absolute best work.',
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'We work together seamlessly to achieve extraordinary results.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-card border border-border rounded-lg hover:border-accent transition-colors group">
                <feature.icon className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams-section" className="py-16 sm:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">Our Teams</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 p-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
              <p className="text-red-700 text-sm mt-1">Check your Supabase connection in .env.local and restart the dev server.</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Team Selector */}
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedTeam?.id === team.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card border border-border text-foreground hover:border-accent'
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>

              {/* Team Details */}
              {selectedTeam && (
                <div className="mb-12">
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-8 border border-border mb-12">
                    <h3 className="text-3xl font-bold text-foreground mb-2">{selectedTeam.name}</h3>
                    {selectedTeam.department && (
                      <p className="text-accent font-semibold mb-2">{selectedTeam.department}</p>
                    )}
                    {selectedTeam.description && (
                      <p className="text-muted-foreground">{selectedTeam.description}</p>
                    )}
                  </div>

                  {/* Team Members */}
                  {members.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No members in this team yet.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CEO',
                quote: 'Our team is the heart of our success. They bring passion, creativity, and dedication to every project.',
              },
              {
                name: 'Mike Chen',
                role: 'Project Lead',
                quote: 'Working with such talented individuals has transformed how we approach challenges.',
              },
              {
                name: 'Lisa Rodriguez',
                role: 'Team Member',
                quote: 'The collaboration and support from teammates makes coming to work a joy every single day.',
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-background border border-border rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Connect?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Leave comments on team member cards, share your thoughts, and be part of our community.
          </p>
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-semibold transition-colors inline-flex items-center gap-2"
            >
              Sign In Now <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2026 Team Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
