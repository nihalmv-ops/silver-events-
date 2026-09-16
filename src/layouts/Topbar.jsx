import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Calendar,
  Plus,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/ToastContext'
import { useAuth } from '../hooks/useAuth'

export function Topbar({ onOpenMobileNav, onOpenQuickAction }) {
  const toast = useToast()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleNotificationClick = () => {
    toast.info(
      'Operational Alert',
      'Food Delivered milestone reached: 7,450 / 10,000 pax served at College Function Day 1.'
    )
  }

  const handleLogout = () => {
    logout()
    toast.info('Session Ended', 'You have been logged out of Silver Catering Operations.')
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Mobile menu toggle + Global search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search events, counters, batches, staff..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-all"
          />
        </div>
      </div>

      {/* Right: Operational Status + Quick Action + Alerts + Admin Profile + Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Active Event Status Pill (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#0f172a]">
            College Function D1
          </span>
          <span className="text-[10px] text-[#64748b]">• 10,000 Pax</span>
          <Badge variant="success" size="sm" className="text-[9px] py-0">
            Open
          </Badge>
        </div>

        {/* Quick Action Button */}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenQuickAction}
          className="hidden sm:inline-flex text-xs py-1.5 px-3"
        >
          Quick Action
        </Button>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative p-2 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
          aria-label="View notifications"
          title="Operational Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#e2e8f0]">
          <div className="w-8 h-8 rounded-full bg-[#163324] text-[#c29c5e] flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.avatar || 'SC'}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#0f172a] leading-tight truncate max-w-[120px]">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-[#64748b] leading-tight">
              {user?.role || 'Shift Operations'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors ml-1"
            title="Sign Out"
            aria-label="Sign out of operations system"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
