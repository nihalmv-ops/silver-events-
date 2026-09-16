import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-modal border border-[#e2e8f0]',
          'transform transition-all duration-200 z-10 overflow-hidden flex flex-col max-h-[90vh]',
          modalSizes[size] || modalSizes.md,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#f1f5f9] bg-white">
          <div>
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-[#0f172a]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#64748b] mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#334155]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 px-6 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

