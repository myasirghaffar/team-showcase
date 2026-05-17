import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../authStore'
import { Users, MessageCircle, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ADMIN_HEADER_HEIGHT, ADMIN_HEADER_INNER } from './adminHeaderStyles'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { path: '/admin/teams', label: 'Teams', icon: Users },
    { path: '/admin/members', label: 'Members', icon: Users },
    { path: '/admin/comments', label: 'Comments', icon: MessageCircle },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`${ADMIN_HEADER_HEIGHT} border-b border-border`}>
            <div className={`${ADMIN_HEADER_INNER} gap-3`}>
              <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                A
              </div>
              <div>
                <p className="font-bold text-foreground leading-tight">Admin Panel</p>
                <p className="text-xs text-muted-foreground mt-1">Team Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="px-4 py-3 bg-accent/10 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Logged in as</p>
              <p className="text-sm font-semibold text-foreground mt-1">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
