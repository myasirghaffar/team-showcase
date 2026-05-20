import { useState } from 'react'
import { Languages, Loader2, ExternalLink } from 'lucide-react'
import { getGoogleTranslateUrl, translateToEnglish } from '../utils/translateToEnglish'

export default function CommentTranslate({ text, commentId }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [translation, setTranslation] = useState(null)
  const [showEnglish, setShowEnglish] = useState(false)

  const trimmed = text?.trim()
  if (!trimmed) return null

  const cacheKey = commentId ? `comment-${commentId}` : `text-${trimmed.slice(0, 80)}`

  const handleTranslate = async () => {
    if (translation?.alreadyEnglish) {
      setShowEnglish(false)
      return
    }

    if (translation && showEnglish) {
      setShowEnglish(false)
      return
    }

    if (translation && !showEnglish) {
      setShowEnglish(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await translateToEnglish(trimmed, cacheKey)
      setTranslation(result)

      if (result.alreadyEnglish) {
        setShowEnglish(false)
        setError(null)
      } else {
        setShowEnglish(true)
      }
    } catch (err) {
      setError(err.message || 'Could not translate.')
    } finally {
      setLoading(false)
    }
  }

  const buttonLabel = loading
    ? 'Translating...'
    : translation?.alreadyEnglish
      ? 'Already in English'
      : showEnglish
        ? 'Show original'
        : translation
          ? 'Show English'
          : 'Translate to English'

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleTranslate}
          disabled={loading || translation?.alreadyEnglish}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/80 px-2.5 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:cursor-default disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Languages className="h-3.5 w-3.5" />
          )}
          {buttonLabel}
        </button>

        <a
          href={getGoogleTranslateUrl(trimmed)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          <ExternalLink className="h-3 w-3" />
          Google Translate
        </a>
      </div>

      {translation?.alreadyEnglish && !loading && (
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          This report appears to already be in English.
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}

      {showEnglish && translation && !translation.alreadyEnglish && (
        <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
            English translation
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {translation.translatedText}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Machine translation may be inaccurate. The original text is authoritative.
          </p>
        </div>
      )}
    </div>
  )
}
