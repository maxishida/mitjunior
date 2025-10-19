'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventCloseOnBackdrop?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  preventCloseOnBackdrop = false
}: AdminModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before modal opened
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !preventCloseOnBackdrop) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventCloseOnBackdrop]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !preventCloseOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} bg-[#1A1F2E] border border-[#2D333B] rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          max-h-[90vh] overflow-hidden flex flex-col
          focus:outline-none focus:ring-2 focus:ring-[#00C896] focus:ring-offset-2 focus:ring-offset-[#0F1419]
        `}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D333B]">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-[#F8FAFC]"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#242931] rounded-lg transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalFormProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  submitVariant?: 'primary' | 'danger';
}

export function ModalForm({
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  loading = false,
  disabled = false,
  submitVariant = 'primary'
}: ModalFormProps) {
  const submitButtonClasses = submitVariant === 'danger'
    ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
    : 'bg-[#00C896] text-[#0F1419] hover:bg-[#00A67C]';

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[#2D333B]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-[#242931] border border-[#2D333B] text-[#F8FAFC] rounded-lg hover:bg-[#2D333B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={disabled || loading}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all duration-200
            ${submitButtonClasses}
            ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
            flex items-center gap-2
          `}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  variant = 'danger'
}: ConfirmModalProps) {
  const variantConfig = {
    danger: {
      icon: <div className="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>,
      confirmClass: 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
    },
    warning: {
      icon: <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>,
      confirmClass: 'bg-[#F59E0B] text-white hover:bg-[#D97706]'
    },
    primary: {
      icon: <div className="w-12 h-12 bg-[#00C896]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#00C896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>,
      confirmClass: 'bg-[#00C896] text-[#0F1419] hover:bg-[#00A67C]'
    }
  };

  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={!loading}
      preventCloseOnBackdrop={loading}
    >
      <div className="text-center">
        {config.icon}
        <p className="text-[#CBD5E1] mb-6">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-[#242931] border border-[#2D333B] text-[#F8FAFC] rounded-lg hover:bg-[#2D333B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all duration-200
              ${config.confirmClass}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              flex items-center gap-2
            `}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}