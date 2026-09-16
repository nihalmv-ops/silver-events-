import React from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = {
  default: 'bg-[#f1f5f9] text-[#334155] border-[#e2e8f0]',
  primary: 'bg-[#163324]/10 text-[#163324] border-[#163324]/20',
  success: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
  warning: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
  danger: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
  info: 'bg-[#f0f9ff] text-[#075985] border-[#bae6fd]',
  gold: 'bg-[#fbf6ed] text-[#866a39] border-[#edd9be]',
  outline: 'bg-transparent text-[#475569] border-[#cbd5e1]',
}

const dotColors = {
  default: 'bg-slate-400',
  primary: 'bg-[#163324]',
  success: 'bg-[#10b981]',
  warning: 'bg-[#f59e0b]',
  danger: 'bg-[#ef4444]',
  info: 'bg-[#0ea5e9]',
  gold: 'bg-[#c29c5e]',
  outline: 'bg-slate-400',
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  withDot = false,
  className,
  ...props
}) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase text-[10px]',
        badgeVariants[variant] || badgeVariants.default,
        sizeClasses,
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant] || dotColors.default)}
        />
      )}
      {children}
    </span>
  )
}

