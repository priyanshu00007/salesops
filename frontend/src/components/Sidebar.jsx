import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleConfig } from '../data/permissions';
import { LogOut, Hexagon } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const config = getRoleConfig(user?.role);

  // Fallback defaults in case config is missing
  const roleColor = config?.color || '#3B82F6'; 
  const roleLabel = config?.label || 'User';
  const sidebarGroups = config?.sidebar || [];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-800 bg-[#03062c] text-white">
      {/* Header / Logo Area */}
      <div className="flex flex-col border-b border-gray-800/60 px-6 py-6">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <Hexagon className="h-6 w-6 text-blue-500 fill-blue-500/20" />
          <span>SalesOps</span>
        </div>
        <div className="mt-3 flex">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm"
            style={{ backgroundColor: roleColor }}
          >
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        {sidebarGroups.length > 0 ? (
          sidebarGroups.map((group) => (
            <div key={group.section} className="mb-6 last:mb-0">
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                {group.section}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gray-800/80 text-white shadow-sm'
                          : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Subtle Active Indicator Bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-blue-500" />
                        )}
                        
                        {/* Dynamic Icon Rendering */}
                        <div className={`flex items-center justify-center transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                          {item.icon}
                        </div>
                        
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 text-sm text-gray-500">No navigation items available.</div>
        )}
      </nav>

      {/* User Profile & Logout Footer */}
      <div className="mt-auto border-t border-gray-800/60 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-800/40">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: roleColor }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-200">{user?.name || 'Guest User'}</div>
            <div className="truncate text-xs text-gray-500">{user?.email || 'No email provided'}</div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800/40 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}