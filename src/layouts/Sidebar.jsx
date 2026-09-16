import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navigationGroups } from '../data/navigation'
import { Badge } from '../components/ui/Badge'
import { cn } from '../utils/cn'
import { Sparkles, Utensils, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/ToastContext'

export function Sidebar({ className, isCollapsed = false, onToggleCollapse }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const toast = useToast()

  const handleLogout = () => {
    logout()
    toast.info('Signed Out', 'You have been signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'w-64 bg-[#0e1f16] text-white flex flex-col border-r border-[#1e3a2b] shrink-0 transition-all duration-300 z-30 select-none',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#1a3827] flex items-center justify-between shrink-0 bg-[#0a1811]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Brand Icon Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c29c5e] to-[#9d8050] p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-[#163324] rounded-[10px] flex items-center justify-center">
              <Utensils className="w-5 h-5 text-[#c29c5e]" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm tracking-wider text-white truncate font-sans">
                SILVER CATERING
              </span>
              <span className="text-[10px] tracking-tight text-[#94a3b8] truncate font-light">
                Event Administration & Ops
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6c8777] mb-2">
                {group.title}
              </h4>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.path === '/' || item.path === '/dashboard'
                    ? location.pathname === '/' || location.pathname === '/dashboard'
                    : location.pathname.startsWith(item.path)

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#1b3f2c] text-[#dfbe82] shadow-sm font-semibold'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-[#142e20]'
                    )}
                  >
                    {/* Active Accent Border Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#c29c5e] rounded-r-full" />
                    )}

                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-[#c29c5e]'
                          : 'text-[#85a392] group-hover:text-white'
                      )}
                    />

                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <Badge
                        variant={item.badgeVariant || 'default'}
                        size="sm"
                        className="ml-auto text-[9px] px-1.5 py-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Live Operations & User Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#1a3827] bg-[#0a1811]/90 space-y-2">
          {/* User pill */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#142e20]/60 border border-[#1e3a2b] text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-[#163324] text-[#c29c5e] text-[10px] font-bold flex items-center justify-center shrink-0">
                {user?.avatar || 'SC'}
              </div>
              <span className="text-[#cbd5e1] truncate font-medium text-[11px]">
                {user?.email || 'admin@silvercatering.in'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 rounded text-[#94a3b8] hover:text-[#ef4444] transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-[#142e20]/80 border border-[#234d37] space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#e2e8f0]">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                Live Catering Active
              </span>
              <span className="text-[9px] text-[#9d8050] font-bold uppercase tracking-wider">
                Phase 2
              </span>
            </div>
            <p className="text-[10px] text-[#94a3b8] leading-tight font-light truncate">
              College Function (Day 1)
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
