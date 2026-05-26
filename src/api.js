import { supabase, isSupabaseConfigured } from './supabase'

const baseUrl = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function requireClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and restart the dev server.'
    )
  }
  return supabase
}

function defaultHeaders() {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
  }
}

/** Direct REST calls avoid Supabase client deadlocks with onAuthStateChange */
async function restRequest(path, options = {}) {
  if (!baseUrl || !anonKey) {
    throw new Error('Supabase is not configured')
  }

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...defaultHeaders(),
      ...options.headers,
    },
  })

  const text = await response.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      throw new Error('Invalid response from server')
    }
  }

  if (!response.ok) {
    const message =
      body?.message || body?.error || body?.hint || response.statusText
    throw new Error(message || `HTTP ${response.status}`)
  }

  return body
}

function mapProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

async function fetchProfile(userId) {
  const rows = await restRequest(
    `profiles?select=*&id=eq.${userId}&limit=1`
  )
  if (!rows?.length) throw new Error('Profile not found')
  return mapProfile(rows[0])
}

async function userFromSession(session) {
  if (!session?.user) return null

  try {
    return await fetchProfile(session.user.id)
  } catch {
    const meta = session.user.user_metadata || {}
    return {
      id: session.user.id,
      email: session.user.email,
      fullName: meta.full_name || session.user.email?.split('@')[0] || 'User',
      role: meta.role || 'user',
      bio: null,
      avatarUrl: null,
    }
  }
}

export const api = {
  async signUp(email, password, fullName) {
    const client = requireClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'user' },
      },
    })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Sign up failed. Please try again.')

    if (!data.session) {
      return { needsEmailVerification: true, email }
    }

    return {
      needsEmailVerification: false,
      user: await userFromSession(data.session),
    }
  },

  async login(email, password) {
    const client = requireClient()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)
    if (!data.session?.user) throw new Error('Invalid email or password')

    return userFromSession(data.session)
  },

  async logout() {
    const client = requireClient()
    const { error } = await client.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async getSessionUser() {
    if (!isSupabaseConfigured) return null

    const client = requireClient()
    const {
      data: { session },
    } = await client.auth.getSession()

    if (session?.user) {
      return userFromSession(session)
    }
    return null
  },

  onAuthStateChange(callback) {
    if (!supabase) return () => {}

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Defer: awaiting Supabase inside this handler deadlocks other client calls
      setTimeout(async () => {
        if (event === 'SIGNED_OUT') {
          callback(null)
          return
        }

        if (session?.user) {
          const profile = await userFromSession(session)
          callback(profile)
          return
        }

        if (event === 'INITIAL_SESSION') {
          callback(null)
        }
      }, 0)
    })

    return () => subscription.unsubscribe()
  },

  async updateUser(updates) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) throw new Error('Not signed in')

    const rows = await restRequest(
      `profiles?id=eq.${user.id}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          full_name: updates.fullName,
          bio: updates.bio,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString(),
        }),
      }
    )

    const updated = Array.isArray(rows) ? rows[0] : rows
    return mapProfile(updated)
  },

  async getTeams() {
    return restRequest('teams?select=*&order=created_at.desc')
  },

  async getMembers(teamId) {
    return restRequest(
      `team_members?select=*&team_id=eq.${teamId}&order=name.asc`
    )
  },

  async getMember(id) {
    const rows = await restRequest(
      `team_members?select=*,teams(id,name,department)&id=eq.${id}&limit=1`
    )
    return rows?.length ? rows[0] : null
  },

  async getCommentCount(memberId) {
    const rows = await restRequest(
      `team_member_comments?select=id&team_member_id=eq.${memberId}`
    )
    return Array.isArray(rows) ? rows.length : 0
  },

  async addTeam(teamData) {
    const rows = await restRequest('teams', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(teamData),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async addMember(memberData) {
    const rows = await restRequest('team_members', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(memberData),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async updateTeam(id, teamData) {
    const rows = await restRequest(`teams?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        ...teamData,
        updated_at: new Date().toISOString(),
      }),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async updateMember(id, memberData) {
    const rows = await restRequest(`team_members?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        ...memberData,
        updated_at: new Date().toISOString(),
      }),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async deleteTeam(id) {
    await restRequest(`teams?id=eq.${id}`, { method: 'DELETE' })
  },

  async deleteMember(id) {
    await restRequest(`team_members?id=eq.${id}`, { method: 'DELETE' })
  },

  async getComments(memberId) {
    return restRequest(
      `team_member_comments?select=*&team_member_id=eq.${memberId}&order=created_at.desc`
    )
  },

  async getAllComments() {
    return restRequest(
      'team_member_comments?select=*&order=created_at.desc'
    )
  },

  async addComment(commentData) {
    const rows = await restRequest('team_member_comments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(commentData),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async updateCommentStatus(id, status) {
    const rows = await restRequest(`team_member_comments?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status }),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async deleteComment(id) {
    await restRequest(`team_member_comments?id=eq.${id}`, {
      method: 'DELETE',
    })
  },

  async uploadMemberAvatar(file, memberId = null) {
    const client = requireClient()

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a JPG, PNG, WebP, or GIF image.')
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('Image must be smaller than 5 MB.')
    }

    const ext =
      file.type === 'image/jpeg'
        ? 'jpg'
        : file.type === 'image/png'
          ? 'png'
          : file.type === 'image/webp'
            ? 'webp'
            : 'gif'

    const folder = memberId || 'uploads'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await client.storage.from('member-avatars').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

    if (error) throw new Error(error.message)

    const { data: urlData } = client.storage.from('member-avatars').getPublicUrl(data.path)
    return urlData.publicUrl
  },

  async getBlogPosts({ limit } = {}) {
    let path = 'blog_posts?select=*&order=published_at.desc'
    if (limit) path += `&limit=${limit}`
    return restRequest(path)
  },

  async getBlogPostBySlug(slug) {
    const rows = await restRequest(
      `blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`
    )
    return rows?.length ? rows[0] : null
  },

  async getBlogCommentCount(postId) {
    const rows = await restRequest(
      `blog_post_comments?select=id&blog_post_id=eq.${postId}&status=eq.approved`
    )
    return Array.isArray(rows) ? rows.length : 0
  },

  async getBlogComments(postId) {
    return restRequest(
      `blog_post_comments?select=*&blog_post_id=eq.${postId}&status=eq.approved&order=created_at.desc`
    )
  },

  async addBlogComment(commentData) {
    const rows = await restRequest('blog_post_comments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(commentData),
    })
    return Array.isArray(rows) ? rows[0] : rows
  },

  async deleteBlogComment(id) {
    await restRequest(`blog_post_comments?id=eq.${id}`, { method: 'DELETE' })
  },

  async uploadCommentMedia(file, memberId) {
    const client = requireClient()

    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    const isImage = imageTypes.includes(file.type)
    const isVideo = videoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      throw new Error('Please upload an image (JPG, PNG, WebP, GIF) or video (MP4, WebM, MOV).')
    }

    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error(isVideo ? 'Video must be smaller than 25 MB.' : 'Image must be smaller than 5 MB.')
    }

    const extByType = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
    }
    const ext = extByType[file.type] || 'bin'
    const path = `${memberId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await client.storage.from('comment-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

    if (error) throw new Error(error.message)

    const { data: urlData } = client.storage.from('comment-media').getPublicUrl(data.path)
    return {
      url: urlData.publicUrl,
      type: isVideo ? 'video' : 'image',
    }
  },
}
