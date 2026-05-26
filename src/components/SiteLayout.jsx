import { Outlet, useLocation } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import AppFooter from './AppFooter'
import AdminSidebar from './AdminSidebar'

const AUTH_PATHS = new Set(['/login', '/signup'])

export default function SiteLayout() {
  const { pathname } = useLocation()
  const isAuth = AUTH_PATHS.has(pathname)
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <div className="page-shell flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-64">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  }

  if (isAuth) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <AppNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
