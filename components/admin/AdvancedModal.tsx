'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2, RotateCw } from 'lucide-react';

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventCloseOnBackdrop?: boolean;
  preventCloseOnEscape?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  draggable?: boolean;
  className?: string;
  zIndex?: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface ModalPosition {
  x: number;
  y: number;
}

interface ModalSize {
  width: number;
  height: number;
}

export function AdvancedModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  preventCloseOnBackdrop = false,
  preventCloseOnEscape = false,
  resizable = false,
  maximizable = false,
  draggable = false,
  className = '',
  zIndex = 50,
  loading = false,
  error = null,
  onRetry
}: AdvancedModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<ModalPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>({ width: 0, height: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dragStartPos = useRef<ModalPosition>({ x: 0, y: 0 });
  const modalStartPos = useRef<ModalPosition>({ x: 0, y: 0 });
  const resizeStartSize = useRef<ModalSize>({ width: 0, height: 0 });
  const resizeStartPos = useRef<ModalPosition>({ x: 0, y: 0 });

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';

      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !preventCloseOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, preventCloseOnEscape]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current && isMaximized) {
        // Recalculate maximized size
        const padding = 40;
        setModalSize({
          width: window.innerWidth - padding * 2,
          height: window.innerHeight - padding * 2
        });
      }
    };

    if (isMaximized) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMaximized]);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !preventCloseOnBackdrop) {
      onClose();
    }
  }, [onClose, preventCloseOnBackdrop]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;

    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    modalStartPos.current = { ...position };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [draggable, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    setPosition({
      x: modalStartPos.current.x + deltaX,
      y: modalStartPos.current.y + deltaY
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (!resizable) return;

    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartSize.current = { ...modalSize };
    resizeStartPos.current = { x: e.clientX, y: e.clientY };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [resizable, modalSize]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;

    setModalSize({
      width: Math.max(300, resizeStartSize.current.width + deltaX),
      height: Math.max(200, resizeStartSize.current.height + deltaY)
    });
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, []);

  const handleMaximize = useCallback(() => {
    if (!maximizable) return;

    if (isMaximized) {
      // Restore original size and position
      setIsMaximized(false);
      setPosition({ x: 0, y: 0 });
    } else {
      // Maximize
      const padding = 40;
      setIsMaximized(true);
      setPosition({ x: padding, y: padding });
      setModalSize({
        width: window.innerWidth - padding * 2,
        height: window.innerHeight - padding * 2
      });
    }
  }, [maximizable, isMaximized]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    ...(isMaximized ? {
      width: modalSize.width,
      height: modalSize.height
    } : modalSize.width > 0 ? {
      width: modalSize.width,
      height: modalSize.height
    } : {})
  };

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ zIndex }}
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
          ${isMaximized ? 'fixed inset-4' : ''}
          ${isDragging ? 'cursor-grabbing' : draggable ? 'cursor-grab' : ''}
          ${isResizing ? 'cursor-se-resize' : ''}
          ${className}
        `}
        style={modalStyle}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div
          className={`
            flex items-center justify-between p-6 border-b border-[#2D333B]
            ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
          onMouseDown={handleMouseDown}
        >
          <h2 id="modal-title" className="text-xl font-semibold text-[#F8FAFC]">
            {title}
          </h2>

          <div className="flex items-center gap-2">
            {maximizable && (
              <button
                onClick={handleMaximize}
                className="p-2 hover:bg-[#242931] rounded-lg transition-colors"
                title={isMaximized ? 'Restaurar' : 'Maximizar'}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4 text-[#64748B]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[#64748B]" />
                )}
              </button>
            )}

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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: isMaximized ? 'calc(100% - 140px)' : '60vh' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <div className="w-12 h-12 border-4 border-[#242931] border-t-[#00C896] rounded-full animate-spin"></div>
              <p className="text-[#64748B]">Carregando...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <div className="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div className="text-center">
                <p className="text-[#EF4444] font-medium mb-2">Erro ao carregar</p>
                <p className="text-sm text-[#64748B] mb-4">{error}</p>
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Resize Handle */}
        {resizable && !isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[#64748B] border-opacity-50"></div>
          </div>
        )}
      </div>
    </div>
  );

  // Use portal for better performance and z-index management
  return typeof window !== 'undefined' ? createPortal(content, document.body) : null;
}

// Optimized modal queue manager
export class ModalManager {
  private static instance: ModalManager;
  private activeModals: Set<string> = new Set();
  private modalQueue: Array<{ id: string; priority: number }> = [];

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  canOpenModal(id: string, priority: number = 0): boolean {
    if (this.activeModals.has(id)) {
      return false;
    }

    // If no modals are active, allow opening
    if (this.activeModals.size === 0) {
      return true;
    }

    // Check priority against existing modals
    return priority > 0;
  }

  openModal(id: string, priority: number = 0): boolean {
    if (!this.canOpenModal(id, priority)) {
      return false;
    }

    this.activeModals.add(id);
    return true;
  }

  closeModal(id: string): void {
    this.activeModals.delete(id);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.modalQueue.length > 0 && this.activeModals.size === 0) {
      const nextModal = this.modalQueue.shift();
      if (nextModal) {
        this.activeModals.add(nextModal.id);
      }
    }
  }

  getActiveModalCount(): number {
    return this.activeModals.size;
  }
}