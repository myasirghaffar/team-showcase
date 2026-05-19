import { create } from 'zustand'
import { api } from './api'
import { isSupabaseConfigured, supabase } from './supabase'

let authUnsubscribe = null

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: () => {
    if (get().initialized) return

    if (!isSupabaseConfigured || !supabase) {
      set({ initialized: true, loading: false })
      return
    }

    set({ loading: true })

    if (authUnsubscribe) authUnsubscribe()

    authUnsubscribe = api.onAuthStateChange((user) => {
      set({
        user,
        initialized: true,
        loading: false,
      })
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    })
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null })
    try {
      const result = await api.signUp(email, password, fullName)
      if (result.needsEmailVerification) {
        set({ loading: false, error: null })
        return result
      }
      localStorage.setItem('user', JSON.stringify(result.user))
      set({ user: result.user, loading: false })
      return result
    } catch (err) {
      const error = err.message || 'Sign up failed'
      set({ error, loading: false })
      throw err
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const user = await api.login(email, password)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, loading: false })
      return user
    } catch (err) {
      const error = err.message || 'Login failed'
      set({ error, loading: false })
      throw err
    }
  },

  logout: async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error('[auth] logout error:', err)
    }
    localStorage.removeItem('user')
    set({ user: null, error: null })
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null })
    try {
      const updatedUser = await api.updateUser(updates)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      set({ user: updatedUser, loading: false })
      return updatedUser
    } catch (err) {
      const error = err.message || 'Update failed'
      set({ error, loading: false })
      throw err
    }
  },

  isAdmin: () => {
    const { user } = get()
    return user?.role === 'admin'
  },

  clearError: () => set({ error: null }),
}))
