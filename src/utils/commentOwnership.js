const MY_COMMENTS_KEY = 'con-artists-my-comment-ids'

export function getMyCommentIds() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MY_COMMENTS_KEY)
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function trackMyComment(commentId) {
  if (!commentId || typeof window === 'undefined') return
  const ids = getMyCommentIds()
  if (!ids.includes(commentId)) {
    localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify([...ids, commentId]))
  }
}

export function untrackMyComment(commentId) {
  if (typeof window === 'undefined') return
  const ids = getMyCommentIds().filter((id) => id !== commentId)
  localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify(ids))
}

export function canDeleteComment(comment, user) {
  if (!comment?.id) return false
  if (user?.role === 'admin') return true
  if (user?.id && comment.user_id === user.id) return true
  return getMyCommentIds().includes(comment.id)
}
