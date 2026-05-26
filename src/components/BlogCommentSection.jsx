import { useEffect, useState } from 'react'
import { MessageSquare, Trash2 } from 'lucide-react'
import { api } from '../api'
import { useAuthStore } from '../authStore'
import CommentTranslate from './CommentTranslate'
import { getCommentDisplayName } from './CommentMedia'
import {
  canDeleteComment,
  trackMyComment,
  untrackMyComment,
} from '../utils/commentOwnership'

export default function BlogCommentSection({ postId }) {
  const user = useAuthStore((state) => state.user)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [postAnonymously, setPostAnonymously] = useState(!user)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    setPostAnonymously(!user)
  }, [user])

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const data = await api.getBlogComments(postId)
      setComments(data || [])
    } catch (err) {
      console.error('[crime-dossier] Error loading blog comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    setFormError(null)

    const text = commentText.trim()
    if (!text) {
      setFormError('Write a comment before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const anonymous = !user || postAnonymously
      const payload = {
        blog_post_id: postId,
        name: anonymous ? 'Anonymous' : user.fullName,
        email: anonymous ? null : user.email,
        comment: text,
        user_id: user?.id || null,
        status: 'approved',
      }

      const created = await api.addBlogComment(payload)
      if (!user?.id && created?.id) {
        trackMyComment(created.id)
      }

      setCommentText('')
      await loadComments()
    } catch (err) {
      console.error('[crime-dossier] Error submitting blog comment:', err)
      setFormError(err.message || 'Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (comment) => {
    if (!canDeleteComment(comment, user)) return
    if (!confirm('Delete this comment?')) return

    setDeletingId(comment.id)
    try {
      await api.deleteBlogComment(comment.id)
      untrackMyComment(comment.id)
      await loadComments()
    } catch (err) {
      setFormError(err.message || 'Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="horror-card p-6 sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
        <MessageSquare className="h-5 w-5 text-accent" />
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
                  <p className="font-medium text-foreground">{getCommentDisplayName(comment)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {canDeleteComment(comment, user) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment)}
                    disabled={deletingId === comment.id}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === comment.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-foreground" dir="auto">
                {comment.comment}
              </p>
              <CommentTranslate text={comment.comment} commentId={comment.id} />
            </article>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <form onSubmit={handleSubmitComment} className="space-y-4 border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">Leave a comment</h3>

        {user ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={postAnonymously}
              onChange={(e) => setPostAnonymously(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            Post anonymously
          </label>
        ) : (
          <p className="text-xs text-muted-foreground">
            You are commenting as Anonymous. You can delete your comment from this browser later.
          </p>
        )}

        {user && !postAnonymously && (
          <p className="text-xs text-muted-foreground">
            Commenting as <span className="font-medium text-foreground">{user.fullName}</span>
          </p>
        )}

        <textarea
          placeholder="Share your perspective on this article..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
        >
          {submitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>
    </section>
  )
}
