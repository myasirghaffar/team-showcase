import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, User } from 'lucide-react'
import { api } from '../api'
import BlogCoverImage from './BlogCoverImage'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogCard({ post, showCommentCount = true }) {
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    if (!showCommentCount || !post?.id) return
    let cancelled = false
    api
      .getBlogCommentCount(post.id)
      .then((count) => {
        if (!cancelled) setCommentCount(count)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [post?.id, showCommentCount])

  return (
    <article className="horror-card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-glow-sm">
      <Link to={`/blog/${post.slug}`} className="block flex-1">
        <BlogCoverImage
          src={post.cover_image_url}
          alt={post.title}
          className="w-full"
        />
        <div className="p-6 sm:p-8">
          <h3 className="mb-3 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author_name}
            </span>
            <span>{formatDate(post.published_at)}</span>
            {showCommentCount && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
