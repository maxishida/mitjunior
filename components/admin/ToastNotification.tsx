'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Loader2
} from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration (unless persistent)
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4 pointer-events-none">
      <div className="space-y-4">
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
            style={{
              animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`
            }}
          />
        ))}
      </div>
    </div>,
    document.body
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  style?: React.CSSProperties;
}

function ToastItem({ toast, onRemove, style }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#00C896]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />;
      case 'info':
        return <Info className="w-5 h-5 text-[#3B82F6]" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-[#00C896] animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#00C896]/10 border-[#00C896]/20 text-[#00C896]';
      case 'error':
        return 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]';
      case 'warning':
        return 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]';
      case 'info':
        return 'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]';
      case 'loading':
        return 'bg-[#00C896]/10 border-[#00C896]/20 text-[#00C896]';
      default:
        return 'bg-[#64748B]/10 border-[#64748B]/20 text-[#64748B]';
    }
  };

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-4 p-4 bg-[#1A1F2E] border rounded-xl shadow-2xl
        backdrop-blur-md transition-all duration-300
        ${getColors()}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={style}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm text-[#CBD5E1] break-words">
          {toast.message}
        </p>

        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {!toast.persistent && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-[#242931] transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4 text-[#64748B]" />
        </button>
      )}
    </div>
  );
}

// Utility functions for common toast operations
export const toast = {
  success: (message: string, title?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    return addToast({ type: 'success', message, title, ...options });
  },

  error: (message: string, title?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    return addToast({
      type: 'error',
      message,
      title,
      duration: 8000, // Longer duration for errors
      ...options
    });
  },

  warning: (message: string, title?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    return addToast({ type: 'warning', message, title, ...options });
  },

  info: (message: string, title?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    return addToast({ type: 'info', message, title, ...options });
  },

  loading: (message: string, title?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    return addToast({
      type: 'loading',
      message,
      title,
      duration: 0, // Loading toasts are persistent by default
      ...options
    });
  },

  dismiss: (id: string) => {
    const { removeToast } = useToast();
    removeToast(id);
  },

  dismissAll: () => {
    const { clearAllToasts } = useToast();
    clearAllToasts();
  }
};

// Add CSS animations for toast
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .toast-exit {
      animation: slideOutRight 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}