import React from 'react'
import { Badge } from './Badge'
import { cn } from '../../utils/cn'

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = 'gold',
  actions,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-[#e2e8f0]',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] font-sans">
            {title}
          </h1>
          {badge && (
            <Badge variant={badgeVariant} withDot>
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-[#64748b] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

