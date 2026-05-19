export function getCommentDisplayName(comment) {
  const name = comment?.name?.trim()
  if (!name || name.toLowerCase() === 'anonymous') return 'Anonymous'
  return name
}

export default function CommentMedia({ comment, className = '' }) {
  if (!comment?.media_url) return null

  if (comment.media_type === 'video') {
    return (
      <div className={`mt-3 overflow-hidden rounded-lg border border-border ${className}`}>
        <video
          src={comment.media_url}
          controls
          className="max-h-80 w-full bg-black"
          preload="metadata"
        >
          Your browser does not support video playback.
        </video>
      </div>
    )
  }

  return (
    <div className={`mt-3 overflow-hidden rounded-lg border border-border ${className}`}>
      <img
        src={comment.media_url}
        alt="Comment attachment"
        className="max-h-80 w-full object-contain bg-accent/5"
      />
    </div>
  )
}
