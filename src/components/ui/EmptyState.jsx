import React from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import { cn } from '../../utils/cn'

export function EmptyState({
  icon: Icon,
  title = 'No records available',
  description = 'There are no active records in this section yet. As operations proceed, data will populate here automatically.',
  action,
  phase = 'Phase 2 Module',
  className,
}) {
  return (
    <Card className={cn('p-10 text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-6 border-dashed border-2 border-[#cbd5e1]/70', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] mb-4 shadow-sm">
          {React.isValidElement(Icon) ? Icon : <Icon className="w-7 h-7 text-[#163324]" />}
        </div>
      )}

      {phase && (
        <div className="mb-2">
          <Badge variant="gold" size="sm">
            {phase}
          </Badge>
        </div>
      )}

      <h3 className="text-lg font-semibold text-[#0f172a] tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#64748b] mt-1.5 mb-6 max-w-md leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </Card>
  )
}

