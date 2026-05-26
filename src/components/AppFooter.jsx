import { Link } from 'react-router-dom'
import { APP_NAME } from '../constants'

export default function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto shrink-0 border-t border-border py-8"
      style={{ backgroundColor: 'var(--card)' }}
    >
      <div className="mx-auto max-w-7xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          &copy; {year} {APP_NAME}. For informational purposes only.
        </p>
        <Link
          to="/privacy-policy"
          className="text-sm text-accent transition-colors hover:text-accent/80 hover:underline"
        >
          Privacy Policy &amp; Content Rules
        </Link>
      </div>
    </footer>
  )
}
