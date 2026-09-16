import React from 'react'
import { Card } from './Card'
import { cn } from '../../utils/cn'

const accentStyles = {
  primary: {
    iconBg: 'bg-[#163324]/10 text-[#163324]',
    borderHover: 'hover:border-[#163324]/40',
  },
  gold: {
    iconBg: 'bg-[#fbf6ed] text-[#9d8050]',
    borderHover: 'hover:border-[#c29c5e]/40',
  },
  success: {
    iconBg: 'bg-[#ecfdf5] text-[#059669]',
    borderHover: 'hover:border-[#10b981]/40',
  },
  silver: {
    iconBg: 'bg-[#f1f5f9] text-[#475569]',
    borderHover: 'hover:border-[#94a3b8]/40',
  },
  warning: {
    iconBg: 'bg-[#fffbeb] text-[#d97706]',
    borderHover: 'hover:border-[#f59e0b]/40',
  },
  error: {
    iconBg: 'bg-[#fef2f2] text-[#dc2626]',
    borderHover: 'hover:border-[#ef4444]/40',
  },
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendType = 'positive',
  accentColor = 'primary',
  className,
  ...props
}) {
  const accent = accentStyles[accentColor] || accentStyles.primary

  return (
    <Card
      className={cn(
        'p-5 transition-all duration-200 hover:shadow-card-hover group relative overflow-hidden',
        accent.borderHover,
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-[#0f172a] font-sans">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0',
              accent.iconBg
            )}
          >
            {React.isValidElement(Icon) ? Icon : <Icon className="w-5 h-5" />}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
          {subtext && <span className="text-[#64748b] truncate">{subtext}</span>}
          {trend && (
            <span
              className={cn(
                'font-medium shrink-0 ml-2',
                trendType === 'positive' && 'text-[#059669]',
                trendType === 'warning' && 'text-[#d97706]',
                trendType === 'active' && 'text-[#163324] font-semibold flex items-center gap-1',
                trendType === 'neutral' && 'text-[#64748b]'
              )}
            >
              {trendType === 'active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              )}
              {trend}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}

