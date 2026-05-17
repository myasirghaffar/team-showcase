import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, User, X } from 'lucide-react'
import { api } from '../api'
import { getMemberAvatarUrl } from '../utils/memberAvatar'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export default function MemberAvatarUpload({
  value = '',
  memberName = '',
  memberId = null,
  onChange,
  onError,
  onUploadingChange,
}) {
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(Boolean(value && !value.includes('/member-avatars/')))

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const displayUrl =
    previewUrl || value || getMemberAvatarUrl({ name: memberName || 'Member', avatar: '' })

  const setPreview = (url) => {
    setPreviewUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return url
    })
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    onUploadingChange?.(true)
    onError?.(null)

    try {
      const publicUrl = await api.uploadMemberAvatar(file, memberId)
      onChange(publicUrl)
      setShowUrlInput(false)
    } catch (err) {
      setPreview('')
      onError?.(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const handleClear = () => {
    setPreview('')
    onChange('')
    setShowUrlInput(false)
  }

  return (
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-foreground">Profile photo</label>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-background/50 p-4 sm:flex-row sm:items-start">
        <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-accent/10 sm:mx-0">
          {displayUrl ? (
            <img src={displayUrl} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-accent">
              <User className="h-10 w-10 opacity-60" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              <ImagePlus className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload from computer'}
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput((v) => !v)}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 disabled:opacity-50"
            >
              <Link2 className="h-4 w-4" />
              {showUrlInput ? 'Hide URL' : 'Use image URL'}
            </button>
            {(value || previewUrl) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          {showUrlInput && (
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setPreview('')
                onChange(e.target.value)
              }}
              disabled={uploading}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              placeholder="https://example.com/photo.jpg"
            />
          )}

          <p className="text-xs text-muted-foreground">
            Upload JPG, PNG, WebP, or GIF (max 5 MB). Leave empty for an auto-generated avatar from
            the member&apos;s name.
          </p>
        </div>
      </div>
    </div>
  )
}
