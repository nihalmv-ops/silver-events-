import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarPlus,
  UtensilsCrossed,
  ChefHat,
  PackageCheck,
  Truck,
  Receipt,
  CheckSquare,
  ArrowRight,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const actionItems = [
  {
    id: 'create-event',
    title: 'Create Event',
    description: 'Schedule new function',
    path: '/events',
    icon: CalendarPlus,
    color: 'hover:border-[#163324]/40 text-[#163324] bg-[#163324]/5',
  },
  {
    id: 'add-menu',
    title: 'Add Menu',
    description: 'Courses & dishes',
    path: '/catering-menu',
    icon: UtensilsCrossed,
    color: 'hover:border-[#c29c5e]/40 text-[#9d8050] bg-[#fbf6ed]',
  },
  {
    id: 'food-prep',
    title: 'Food Preparation',
    description: 'Kitchen batching',
    path: '/food-prep',
    icon: ChefHat,
    color: 'hover:border-[#10b981]/40 text-[#059669] bg-[#ecfdf5]',
  },
  {
    id: 'food-packing',
    title: 'Food Packing',
    description: 'Thermal carriers',
    path: '/food-packing',
    icon: PackageCheck,
    color: 'hover:border-[#0284c7]/40 text-[#0284c7] bg-[#f0f9ff]',
  },
  {
    id: 'food-dist',
    title: 'Food Distribution',
    description: 'Buffet dispatch',
    path: '/food-distribution',
    icon: Truck,
    color: 'hover:border-[#8b5cf6]/40 text-[#7c3aed] bg-[#f5f3ff]',
  },
  {
    id: 'add-expense',
    title: 'Add Expense',
    description: 'Internal operations',
    path: '/expenses',
    icon: Receipt,
    color: 'hover:border-[#f59e0b]/40 text-[#d97706] bg-[#fffbeb]',
  },
  {
    id: 'add-task',
    title: 'Add Task',
    description: 'On-site checklist',
    path: '/tasks',
    icon: CheckSquare,
    color: 'hover:border-[#ef4444]/40 text-[#dc2626] bg-[#fef2f2]',
  },
]

export function QuickActions({ className }) {
  const navigate = useNavigate()

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569]">
          Operations Quick Actions
        </h3>
        <span className="text-xs text-[#64748b]">Direct navigation to modules</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {actionItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-start p-3.5 rounded-xl border border-[#e2e8f0] bg-white text-left transition-all duration-200',
                'hover:shadow-card-hover hover:-translate-y-0.5 group focus:outline-none focus:ring-2 focus:ring-[#163324]/20',
                item.color
              )}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#0f172a] group-hover:text-[#163324] leading-tight">
                {item.title}
              </span>
              <span className="text-[10px] text-[#64748b] truncate w-full mt-0.5">
                {item.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
