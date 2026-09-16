import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Select = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      options = [],
      placeholder = 'Select an option',
      className,
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#334155] tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm',
              'py-2 pl-3.5 pr-10 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors',
              'disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:cursor-not-allowed',
              error && 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.length > 0
              ? options.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt
                  const text = typeof opt === 'object' ? opt.label : opt
                  return (
                    <option key={val} value={val}>
                      {text}
                    </option>
                  )
                })
              : children}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#94a3b8]">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select'

