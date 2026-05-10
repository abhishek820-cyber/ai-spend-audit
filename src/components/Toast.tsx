'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))

    // Auto remove
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  }

  const styles = {
    success: {
      container: 'bg-surface-container-lowest border-primary/30',
      icon: 'text-primary',
      text: 'text-on-surface',
    },
    error: {
      container: 'bg-error-container border-error/30',
      icon: 'text-error',
      text: 'text-on-error-container',
    },
    info: {
      container: 'bg-secondary-container border-outline-variant',
      icon: 'text-primary',
      text: 'text-on-secondary-container',
    },
  }

  const style = styles[toast.type]

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        transition-all duration-300 ease-out min-w-[280px] max-w-[400px]
        ${style.container}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <span className={`material-symbols-outlined text-[20px] shrink-0 ${style.icon}`}>
        {icons[toast.type]}
      </span>
      <p className={`text-body-sm font-medium flex-1 ${style.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}