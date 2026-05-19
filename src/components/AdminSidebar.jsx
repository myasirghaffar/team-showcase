import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../authStore'
import { FolderOpen, Skull, MessageCircle, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ADMIN_HEADER_HEIGHT, ADMIN_HEADER_INNER } from './adminHeaderStyles'
import { APP_LOGO_LETTER, UI } from '../constants'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { path: '/admin/teams', label: UI.categories, icon: FolderOpen },
    { path: '/admin/members', label: UI.criminalProfiles, icon: Skull },
    { path: '/admin/comments', label: 'Evidence reports', icon: MessageCircle },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className={`${ADMIN_HEADER_HEIGHT} border-b border-border`}>
            <div className={`${ADMIN_HEADER_INNER} gap-3`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/40 bg-accent/20 font-display text-lg font-bold text-accent">
                {APP_LOGO_LETTER}
              </div>
              <div>
                <p className="font-bold leading-tight text-foreground">Admin Panel</p>
                <p className="mt-1 text-xs text-muted-foreground">Crime archive management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="space-y-3 border-t border-border p-4">
            <div className="rounded-lg bg-accent/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Logged in as</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{user?.fullName}</p>
              <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-red-950/50 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={() => {}}
          role="presentation"
        />
      )}
    </>
  )
}
