import { useState, useEffect } from 'react'
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../api'
import AdminPageHeader from '../components/AdminPageHeader'
import CommentMedia, { getCommentDisplayName } from '../components/CommentMedia'
import CommentTranslate from '../components/CommentTranslate'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await api.getAllComments()
      setComments(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this evidence report permanently?')) return
    try {
      await api.deleteComment(id)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadComments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
        <AdminPageHeader
          title="Manage evidence reports"
          description="Review and remove inappropriate or false reports"
        />

        <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
          {success && (
            <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700">Comment deleted</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{comments.length}</span> total comments.
              Comments publish immediately. Delete anything inappropriate here.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 py-12 text-center">
              <p className="text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">{getCommentDisplayName(comment)}</h3>
                      {comment.email && (
                        <p className="text-sm text-muted-foreground">{comment.email}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>

                  {comment.comment && (
                    <div className="mb-4">
                      <p className="whitespace-pre-wrap text-foreground" dir="auto">
                        {comment.comment}
                      </p>
                      <CommentTranslate text={comment.comment} commentId={comment.id} />
                    </div>
                  )}
                  <CommentMedia comment={comment} className="mb-4" />

                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete comment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </main>
  )
}
