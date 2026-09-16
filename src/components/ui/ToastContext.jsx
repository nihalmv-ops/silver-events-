import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const ToastContext = createContext(null)

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: {
    bg: 'bg-white border-[#10b981]/30 text-[#065f46]',
    iconColor: 'text-[#10b981]',
  },
  error: {
    bg: 'bg-white border-[#ef4444]/30 text-[#991b1b]',
    iconColor: 'text-[#ef4444]',
  },
  warning: {
    bg: 'bg-white border-[#f59e0b]/30 text-[#92400e]',
    iconColor: 'text-[#f59e0b]',
  },
  info: {
    bg: 'bg-white border-[#0ea5e9]/30 text-[#075985]',
    iconColor: 'text-[#0ea5e9]',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
      setToasts((prev) => [...prev, { id, title, description, variant }])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
      return id
    },
    [removeToast]
  )

  const toast = Object.assign(
    (opts) => addToast(opts),
    {
      success: (title, description) => addToast({ title, description, variant: 'success' }),
      error: (title, description) => addToast({ title, description, variant: 'error' }),
      warning: (title, description) => addToast({ title, description, variant: 'warning' }),
      info: (title, description) => addToast({ title, description, variant: 'info' }),
    }
  )

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = toastIcons[t.variant] || Info
          const style = toastStyles[t.variant] || toastStyles.info

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-dropdown transition-all duration-300 animate-in slide-in-from-bottom-5',
                style.bg
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', style.iconColor)} />
              <div className="flex-1 space-y-0.5">
                {t.title && (
                  <p className="text-sm font-semibold text-[#0f172a]">{t.title}</p>
                )}
                {t.description && (
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-md text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.toast
}

