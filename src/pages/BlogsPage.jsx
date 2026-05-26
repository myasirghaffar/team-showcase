import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { api } from '../api'
import BlogCard from '../components/BlogCard'
import { UI } from '../constants'

export default function BlogsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await api.getBlogPosts()
        setPosts(data || [])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="horror-categories-section py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to archive
        </Link>

        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
            <BookOpen className="h-6 w-6 text-accent" />
          </div>
          <h1 className="horror-heading text-4xl sm:text-5xl">Crime {UI.articles}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Analysis, case studies, and investigative journalism on criminal behavior, forensics, and
            unsolved cases.
          </p>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">Loading articles...</p>
        )}

        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-muted-foreground">No articles published yet.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
