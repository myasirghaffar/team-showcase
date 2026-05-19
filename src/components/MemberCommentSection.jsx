import { useEffect, useRef, useState } from 'react'
import { ImagePlus, MessageCircle, Trash2, Video, X } from 'lucide-react'
import { api } from '../api'
import { useAuthStore } from '../authStore'
import CommentMedia, { getCommentDisplayName } from './CommentMedia'
import {
  canDeleteComment,
  trackMyComment,
  untrackMyComment,
} from '../utils/commentOwnership'

const MEDIA_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime'

export default function MemberCommentSection({ memberId }) {
  const user = useAuthStore((state) => state.user)
  const fileInputRef = useRef(null)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [postAnonymously, setPostAnonymously] = useState(!user)
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    setPostAnonymously(!user)
  }, [user])

  useEffect(() => {
    loadComments()
  }, [memberId])

  useEffect(() => {
    return () => {
      if (mediaPreview.startsWith('blob:')) URL.revokeObjectURL(mediaPreview)
    }
  }, [mediaPreview])

  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const data = await api.getComments(memberId)
      setComments(data || [])
    } catch (err) {
      console.error('[v0] Error loading comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const clearMedia = () => {
    setMediaFile(null)
    setMediaPreview((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return ''
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleMediaSelect = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setFormError(null)
    setMediaFile(file)
    setMediaPreview((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    setFormError(null)

    const text = commentText.trim()
    if (!text && !mediaFile) {
      setFormError('Add a message, photo, or video before submitting.')
      return
    }

    setSubmitting(true)
    try {
      let media_url = null
      let media_type = null

      if (mediaFile) {
        const uploaded = await api.uploadCommentMedia(mediaFile, memberId)
        media_url = uploaded.url
        media_type = uploaded.type
      }

      const anonymous = !user || postAnonymously
      const payload = {
        team_member_id: memberId,
        name: anonymous ? 'Anonymous' : user.fullName,
        email: anonymous ? null : user.email,
        comment: text || null,
        media_url,
        media_type,
        user_id: user?.id || null,
        status: 'approved',
      }

      const created = await api.addComment(payload)
      if (!user?.id && created?.id) {
        trackMyComment(created.id)
      }

      setCommentText('')
      clearMedia()
      await loadComments()
    } catch (err) {
      console.error('[v0] Error submitting comment:', err)
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
      await api.deleteComment(comment.id)
      untrackMyComment(comment.id)
      await loadComments()
    } catch (err) {
      setFormError(err.message || 'Failed to delete comment')
    } finally {
      setDeletingId(null)
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
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    title="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === comment.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
              {comment.comment && (
                <p className="mt-2 whitespace-pre-wrap text-foreground">{comment.comment}</p>
              )}
              <CommentMedia comment={comment} />
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
          placeholder="Share your thoughts..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={MEDIA_ACCEPT}
          className="hidden"
          onChange={handleMediaSelect}
          disabled={submitting}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            Add photo
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            <Video className="h-4 w-4" />
            Add video
          </button>
        </div>

        {mediaPreview && (
          <div className="relative rounded-lg border border-border p-2">
            <button
              type="button"
              onClick={clearMedia}
              className="absolute right-3 top-3 rounded-full bg-background/90 p-1 shadow hover:bg-background"
              aria-label="Remove media"
            >
              <X className="h-4 w-4" />
            </button>
            {mediaFile?.type?.startsWith('video/') ? (
              <video src={mediaPreview} controls className="max-h-48 w-full rounded" />
            ) : (
              <img src={mediaPreview} alt="Preview" className="max-h-48 w-full rounded object-contain" />
            )}
          </div>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </section>
  )
}
