import { ADMIN_HEADER_HEIGHT, ADMIN_HEADER_INNER } from './adminHeaderStyles'

export default function AdminPageHeader({ title, description }) {
  return (
    <header
      className={`${ADMIN_HEADER_HEIGHT} border-b border-border bg-gradient-to-r from-accent to-accent/80 text-accent-foreground`}
    >
      <div className={ADMIN_HEADER_INNER}>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight">{title}</h1>
          <p className="mt-1 truncate text-xs leading-tight text-accent-foreground/80">
            {description}
          </p>
        </div>
      </div>
    </header>
  )
}
