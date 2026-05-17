import { create } from 'zustand'
import { api } from './api'

export const useTeamStore = create((set) => ({
  teams: [],
  members: [],
  selectedTeam: null,
  selectedMember: null,
  searchQuery: '',
  loading: false,
  error: null,

  // Team actions
  setTeams: (teams) => set({ teams }),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Members actions
  setMembers: (members) => set({ members }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Fetch teams
  fetchTeams: async () => {
    set({ loading: true, error: null })
    try {
      const teams = await api.getTeams()
      set({ teams: teams || [] })
    } catch (error) {
      console.error('[v0] fetchTeams error:', error)
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Fetch team members
  fetchMembers: async (teamId) => {
    set({ loading: true, error: null })
    try {
      const members = await api.getMembers(teamId)
      set({ members: members || [] })
    } catch (error) {
      console.error('[v0] fetchMembers error:', error)
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Add team
  addTeam: async (teamData) => {
    try {
      const team = await api.addTeam(teamData)
      set((state) => ({ teams: [...state.teams, team] }))
      return team
    } catch (error) {
      console.error('[v0] addTeam error:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Add member
  addMember: async (memberData) => {
    try {
      const member = await api.addMember(memberData)
      set((state) => ({ members: [...state.members, member] }))
      return member
    } catch (error) {
      console.error('[v0] addMember error:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Update team
  updateTeam: async (teamId, updates) => {
    try {
      const team = await api.updateTeam(teamId, updates)
      set((state) => ({
        teams: state.teams.map((t) => (t.id === teamId ? team : t)),
      }))
      return team
    } catch (error) {
      console.error('[v0] updateTeam error:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Update member
  updateMember: async (memberId, updates) => {
    try {
      const member = await api.updateMember(memberId, updates)
      set((state) => ({
        members: state.members.map((m) => (m.id === memberId ? member : m)),
      }))
      return member
    } catch (error) {
      console.error('[v0] updateMember error:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Delete team
  deleteTeam: async (teamId) => {
    try {
      await api.deleteTeam(teamId)
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== teamId),
      }))
    } catch (error) {
      console.error('[v0] deleteTeam error:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Delete member
  deleteMember: async (memberId) => {
    try {
      await api.deleteMember(memberId)
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
      }))
    } catch (error) {
      console.error('[v0] deleteMember error:', error)
      set({ error: error.message })
      throw error
    }
  },
}))
