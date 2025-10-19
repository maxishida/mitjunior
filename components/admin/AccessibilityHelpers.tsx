'use client';

import React, { useEffect, useState } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false
  });

  const [announcement, setAnnouncement] = useState<{
    message: string;
    priority: 'polite' | 'assertive';
  } | null>(null);

  // Detect user preferences
  useEffect(() => {
    const detectPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersLargeText = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // Using as proxy

      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        largeText: prefersLargeText
      }));
    };

    detectPreferences();

    // Listen for changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = () => detectPreferences();
    const handleContrastChange = () => detectPreferences();

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Detect screen reader
  useEffect(() => {
    const detectScreenReader = () => {
      // Common screen reader detection techniques
      const hasAriaLive = document.querySelector('[aria-live]') !== null;
      const hasTabIndex = document.querySelector('[tabindex="-1"]') !== null;

      // Check for screen reader specific behaviors
      const testElement = document.createElement('div');
      testElement.setAttribute('aria-hidden', 'true');
      testElement.style.position = 'absolute';
      testElement.style.left = '-10000px';
      document.body.appendChild(testElement);

      const isScreenReader = testElement.offsetParent === null;
      document.body.removeChild(testElement);

      setSettings(prev => ({
        ...prev,
        screenReader: isScreenReader
      }));
    };

    detectScreenReader();
  }, []);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab, Shift+Tab, Enter, Space, Arrow keys
      if ([9, 13, 32, 37, 38, 39, 40].includes(e.keyCode)) {
        setSettings(prev => ({
          ...prev,
          keyboardNavigation: true
        }));
      }
    };

    const handleMouseDown = () => {
      setSettings(prev => ({
        ...prev,
        keyboardNavigation: false
      }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, priority });

    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncement(null);
    }, 1000);
  };

  // Apply accessibility classes to document
  useEffect(() => {
    const root = document.documentElement;

    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-nav');
    } else {
      root.classList.remove('keyboard-nav');
    }
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}
      {/* Screen reader announcements */}
      {announcement && (
        <div
          aria-live={announcement.priority}
          aria-atomic="true"
          className="sr-only"
        >
          {announcement.message}
        </div>
      )}
    </AccessibilityContext.Provider>
  );
}

// Skip link component for accessibility
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100]
                 bg-[#00C896] text-[#0F1419] px-4 py-2 rounded-lg font-medium
                 focus:outline-none focus:ring-2 focus:ring-[#00C896] focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

// Focus trap component for modals
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
}

export function FocusTrap({ children, isActive }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus first element when trap is activated
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
}

// Accessible form field component
interface AccessibleFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactElement;
}

export function AccessibleField({
  id,
  label,
  error,
  required = false,
  description,
  children
}: AccessibleFieldProps) {
  const fieldId = `${id}-field`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-[#F8FAFC]"
      >
        {label}
        {required && (
          <span className="text-[#EF4444]" aria-label="obrigatório">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-[#64748B]">
          {description}
        </p>
      )}

      {React.cloneElement(children, {
        id: fieldId,
        'aria-describedby': [
          description ? descriptionId : null,
          error ? errorId : null
        ].filter(Boolean).join(' '),
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required
      })}

      {error && (
        <p
          id={errorId}
          className="text-sm text-[#EF4444]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Keyboard navigation helper hook
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement | null }>,
  onActivate?: (id: string) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onActivate) {
          onActivate(items[focusedIndex].id);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  // Focus the currently focused item
  React.useEffect(() => {
    const currentItem = items[focusedIndex];
    if (currentItem?.element) {
      currentItem.element.focus();
    }
  }, [focusedIndex, items]);

  return {
    focusedIndex,
    handleKeyDown,
    setFocusedIndex
  };
}

// ARIA live region component
interface AriaLiveProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive' | 'off';
}

export function AriaLive({ children, priority = 'polite' }: AriaLiveProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Responsive image component with accessibility
interface AccessibleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy'
}: AccessibleImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#242931] rounded-lg animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/placeholder.svg'; // Fallback image
          target.alt = `Imagem não disponível: ${alt}`;
        }}
        className={`
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
      />
    </div>
  );
}