import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import AppNavbar from '../components/AppNavbar'
import { APP_NAME } from '../constants'
import {
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_TITLE,
} from '../content/privacyPolicy'

export default function PrivacyPolicy() {
  return (
    <div className="page-shell min-h-screen">
      <AppNavbar />

      <main className="horror-categories-section py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to archive
          </Link>

          <div className="horror-category-panel mb-8">
            <div className="mb-3 flex items-start gap-3">
              <Shield className="mt-1 h-8 w-8 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent">Privacy Policy</p>
                <h1 className="horror-heading text-3xl sm:text-4xl">{PRIVACY_POLICY_TITLE}</h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {PRIVACY_POLICY_INTRO}
            </p>
          </div>

          <ol className="list-none space-y-6">
            {PRIVACY_POLICY_SECTIONS.map((section, index) => (
              <li key={section.title} className="horror-card p-6 sm:p-8">
                <h2 className="mb-3 text-lg font-semibold text-white">
                  <span className="mr-2 text-accent">{index + 1}.</span>
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {section.body}
                </p>
              </li>
            ))}
          </ol>

          <p
            className="mt-10 text-center text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            &copy; 2026 {APP_NAME}. Last updated May 2026.
          </p>
        </div>
      </main>
    </div>
  )
}
