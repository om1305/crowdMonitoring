import { NavLink, Outlet } from 'react-router-dom'
import ChatbotWidget from '../components/ChatbotWidget'
import { BellIcon, SearchIcon, UserCircleIcon } from '../components/Icons'

function SidebarLink({
  to,
  label,
}: {
  to: string
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
          isActive
            ? 'bg-sky-100 text-sky-700'
            : 'text-gray-600 hover:bg-gray-100',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
        <div className="flex items-center px-6 h-16 border-b border-gray-200">
          <span className="text-base font-semibold text-slate-900">CrowdSense</span>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <SidebarLink to="/dashboard" label="Dashboard" />
          <SidebarLink to="/alerts" label="Alerts" />
          <SidebarLink to="/analytics" label="Analytics" />
          <SidebarLink to="/settings" label="Settings" />
        </nav>
      </aside>

      <div className="ml-64 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center px-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Crowd Monitoring Dashboard
          </h2>

          <div className="flex-1 max-w-xl ml-6">
            <div className="relative">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search zones, alerts..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          <button
            type="button"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Profile"
          >
            <UserCircleIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>

      <ChatbotWidget />
    </div>
  )
}

