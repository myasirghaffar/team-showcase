import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { api } from '../api'
import { useAuthStore } from '../authStore'

export default function MemberCommentSection({ memberId }) {
  const user = useAuthStore((state) => state.user)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState({ name: '', email: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [memberId])

  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const data = await api.getComments(memberId, true)
      setComments(data || [])
    } catch (err) {
      console.error('[v0] Error loading comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    const name = user?.fullName || newComment.name.trim()
    const email = user?.email || newComment.email.trim()
    const commentText = newComment.comment.trim()

    if (!name || !email || !commentText) return

    setSubmitting(true)
    try {
      await api.addComment({
        team_member_id: memberId,
        name,
        email,
        comment: commentText,
        status: 'pending',
      })
      setNewComment({ name: '', email: '', comment: '' })
      alert('Comment submitted! It will appear after admin review.')
    } catch (err) {
      console.error('[v0] Error submitting comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
        <MessageCircle className="h-5 w-5 text-accent" />
        Comments ({comments.length})
      </h2>

      {loadingComments ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="mb-8 space-y-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-border bg-accent/5 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{comment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-foreground">{comment.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <form onSubmit={handleSubmitComment} className="space-y-3 border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">Leave a comment</h3>
        {user ? (
          <p className="text-xs text-muted-foreground">
            Commenting as <span className="font-medium text-foreground">{user.fullName}</span>
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Your name"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </>
        )}
        <textarea
          placeholder="Share your thoughts..."
          value={newComment.comment}
          onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
          rows="4"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
        >
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </section>
  )
}
