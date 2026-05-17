import { useState, useEffect } from 'react'
import { Check, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../api'
import AdminSidebar from '../components/AdminSidebar'
import AdminPageHeader from '../components/AdminPageHeader'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [filteredComments, setFilteredComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadComments()
  }, [])

  useEffect(() => {
    filterComments()
  }, [comments, filter])

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

  const filterComments = () => {
    if (filter === 'all') {
      setFilteredComments(comments)
    } else {
      setFilteredComments(comments.filter((c) => c.status === filter))
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.updateCommentStatus(id, 'approved')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.updateCommentStatus(id, 'rejected')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      await api.deleteComment(id)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const stats = {
    total: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex h-screen min-w-0 flex-1 flex-col md:ml-64">
        <AdminPageHeader
          title="Manage Comments"
          description="Review and moderate comments"
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Success</p>
                <p className="text-green-700 text-sm">Operation completed successfully</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-900' },
              { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-900' },
              { label: 'Approved', value: stats.approved, color: 'bg-green-50 text-green-900' },
              { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-900' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 rounded-lg border ${stat.color}`}>
                <p className="text-xs font-semibold opacity-75 uppercase">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card border border-border text-foreground hover:border-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-12 p-6 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground">No comments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-6 bg-card border rounded-lg ${
                    comment.status === 'pending'
                      ? 'border-yellow-300'
                      : comment.status === 'approved'
                        ? 'border-green-300'
                        : 'border-red-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-foreground">{comment.name}</h3>
                      <p className="text-sm text-muted-foreground">{comment.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        comment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : comment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-foreground mb-4">{comment.comment}</p>

                  <div className="text-xs text-muted-foreground mb-4">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
