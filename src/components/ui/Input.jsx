import React from 'react'
import { cn } from '../../utils/cn'

export const Input = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      startIcon: StartIcon,
      endIcon: EndIcon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#334155] tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-lg">
          {StartIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
              {React.isValidElement(StartIcon) ? StartIcon : <StartIcon className="w-4 h-4" />}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm placeholder:text-[#94a3b8]',
              'focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors',
              'disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:cursor-not-allowed',
              StartIcon ? 'pl-9' : 'pl-3.5',
              EndIcon ? 'pr-9' : 'pr-3.5',
              'py-2',
              error && 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]',
              className
            )}
            {...props}
          />

          {EndIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#94a3b8]">
              {React.isValidElement(EndIcon) ? EndIcon : <EndIcon className="w-4 h-4" />}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-[#ef4444] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#64748b]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

