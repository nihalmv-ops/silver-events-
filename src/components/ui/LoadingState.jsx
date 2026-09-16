import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2
      className={cn(
        'animate-spin text-[#163324]',
        sizes[size] || sizes.md,
        className
      )}
    />
  )
}

export function LoadingState({
  message = 'Loading catering operations...',
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center space-y-3',
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-xs font-medium text-[#64748b] tracking-wide uppercase">
        {message}
      </p>
    </div>
  )
}

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[#e2e8f0]',
        className
      )}
      {...props}
    />
  )
}

