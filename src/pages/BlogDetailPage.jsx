import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { api } from '../api'
import BlogCommentSection from '../components/BlogCommentSection'
import BlogCoverImage from '../components/BlogCoverImage'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      try {
        setLoading(true)
        const data = await api.getBlogPostBySlug(slug)
        if (!data) {
          setError('Article not found')
          setPost(null)
        } else {
          setPost(data)
          setError(null)
        }
      } catch (err) {
        setError(err.message || 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground sm:px-6">
        Loading article...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="mb-6 text-red-400">{error || 'Article not found'}</p>
        <Link to="/blog" className="text-accent hover:underline">
          View all articles
        </Link>
      </div>
    )
  }

  const paragraphs = (post.content || '').split(/\n\n+/).filter(Boolean)

  return (
    <div className="horror-categories-section py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>

        <article className="horror-category-panel mb-10 overflow-hidden p-0">
          <BlogCoverImage
            src={post.cover_image_url}
            alt={post.title}
            aspect="hero"
            className="w-full rounded-none"
          />
          <div className="p-6 sm:p-8">
          <h1 className="horror-heading mb-4 text-3xl sm:text-4xl">{post.title}</h1>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-4 w-4 text-accent" />
              {post.author_name}
            </span>
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
          {post.excerpt && (
            <p className="mb-6 border-l-2 border-accent pl-4 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="space-y-4 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--muted-foreground)' }}>
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          </div>
        </article>

        <BlogCommentSection postId={post.id} />
      </div>
    </div>
  )
}
