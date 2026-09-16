import React, { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navigationGroups } from '../data/navigation'
import { Badge } from '../components/ui/Badge'
import { cn } from '../utils/cn'
import {
  X,
  Utensils,
  LayoutDashboard,
  CalendarDays,
  ChefHat,
  CheckSquare,
  Menu,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/ToastContext'

export function MobileNav({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const toast = useToast()

  // Auto close on route change
  useEffect(() => {
    onClose?.()
  }, [location.pathname, onClose])

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    toast.info('Signed Out', 'You have been signed out.')
    navigate('/login', { replace: true })
    onClose?.()
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-[#0e1f16] text-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="h-16 px-5 border-b border-[#1a3827] flex items-center justify-between shrink-0 bg-[#0a1811]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c29c5e] to-[#9d8050] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#163324] rounded-[10px] flex items-center justify-center">
                <Utensils className="w-4 h-4 text-[#c29c5e]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wider text-white">
                SILVER CATERING
              </span>
              <span className="text-[10px] tracking-tight text-[#94a3b8]">
                Event Administration & Ops
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#163324] transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge Bar */}
        <div className="p-3 mx-4 mt-3 rounded-lg bg-[#142e20] border border-[#1e3a2b] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-[#163324] text-[#c29c5e] text-[10px] font-bold flex items-center justify-center shrink-0">
              {user?.avatar || 'SC'}
            </div>
            <span className="text-white truncate font-medium text-[11px]">
              {user?.email || 'admin@silvercatering.in'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[10px] text-[#ef4444] hover:underline flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3 h-3" />
            Exit
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6c8777] mb-1.5">
                {group.title}
              </h4>

              <div className="space-y-1">
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
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-[#1b3f2c] text-[#dfbe82] font-semibold'
                          : 'text-[#cbd5e1] hover:text-white hover:bg-[#142e20]'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0',
                          isActive ? 'text-[#c29c5e]' : 'text-[#85a392]'
                        )}
                      />
                      <span className="truncate flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || 'default'}
                          size="sm"
                          className="text-[9px] px-1.5 py-0"
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

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#1a3827] bg-[#0a1811] text-xs text-[#94a3b8] flex items-center justify-between">
          <span>Mobile Operations Hub</span>
          <span className="text-[10px] text-[#c29c5e] font-semibold">Phase 2</span>
        </div>
      </div>

      {/* Bottom Navigation Bar for Mobile View (Quick one-thumb access on-ground) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0e1f16] border-t border-[#1a3827] z-30 flex items-center justify-around px-2 shadow-lg"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[10px] font-medium transition-colors',
              isActive || location.pathname === '/' ? 'text-[#c29c5e]' : 'text-[#94a3b8] hover:text-white'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dash</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-[#c29c5e]' : 'text-[#94a3b8] hover:text-white'
            )
          }
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span>Events</span>
        </NavLink>

        <NavLink
          to="/food-prep"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-[#c29c5e]' : 'text-[#94a3b8] hover:text-white'
            )
          }
        >
          <ChefHat className="w-5 h-5 mb-0.5" />
          <span>Kitchen</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-[#c29c5e]' : 'text-[#94a3b8] hover:text-white'
            )
          }
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span>Tasks</span>
        </NavLink>

        <button
          type="button"
          onClick={isOpen ? onClose : () => window.dispatchEvent(new CustomEvent('toggle-mobile-nav'))}
          className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[10px] font-medium text-[#94a3b8] hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  )
}
