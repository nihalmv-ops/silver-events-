import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-[#163324] text-white hover:bg-[#11271b] active:bg-[#0c1c14] border border-[#163324] shadow-sm focus-visible:ring-[#163324]/30',
  secondary:
    'bg-[#c29c5e] text-[#0e1f16] font-semibold hover:bg-[#af8949] active:bg-[#9d8050] border border-[#c29c5e] shadow-sm focus-visible:ring-[#c29c5e]/30',
  outline:
    'bg-white text-[#163324] hover:bg-[#f8fafc] active:bg-[#f1f5f9] border border-[#e2e8f0] hover:border-[#cbd5e1] text-[#0f172a] shadow-sm focus-visible:ring-[#163324]/20',
  ghost:
    'bg-transparent text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a] active:bg-[#e2e8f0] focus-visible:ring-[#163324]/20',
  danger:
    'bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] border border-[#ef4444] shadow-sm focus-visible:ring-[#ef4444]/30',
  gold:
    'bg-[#f5ede0] text-[#866a39] hover:bg-[#ebdcc7] border border-[#e2d0b6] font-medium focus-visible:ring-[#c29c5e]/30',
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
}

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : LeftIcon ? (
          <span className="shrink-0">
            {React.isValidElement(LeftIcon) ? LeftIcon : <LeftIcon className="w-4 h-4" />}
          </span>
        ) : null}

        <span>{children}</span>

        {!isLoading && RightIcon ? (
          <span className="shrink-0">
            {React.isValidElement(RightIcon) ? RightIcon : <RightIcon className="w-4 h-4" />}
          </span>
        ) : null}
      </button>
    )
  }
)

Button.displayName = 'Button'

