import React from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white border border-[#e2e8f0] rounded-xl shadow-card transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'p-5 border-b border-[#f1f5f9] flex flex-col space-y-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        'text-base font-semibold text-[#0f172a] tracking-tight leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-xs text-[#64748b] leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'p-5 pt-0 border-t border-[#f1f5f9] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

