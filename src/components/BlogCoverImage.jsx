import { BookOpen } from 'lucide-react'

export default function BlogCoverImage({
  src,
  alt,
  className = '',
  aspect = 'card',
}) {
  const aspectClass =
    aspect === 'hero'
      ? 'aspect-[21/9] sm:aspect-[2/1]'
      : 'aspect-[16/10]'

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-accent/10 ${aspectClass} ${className}`}
        aria-hidden
      >
        <BookOpen className="h-10 w-10 text-accent/50" />
      </div>
    )
  }

  return (
    <div className={`overflow-hidden bg-background ${aspectClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
