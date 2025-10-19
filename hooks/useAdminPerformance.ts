import { useState, useEffect, useCallback, useRef } from 'react';

// Performance monitoring hook
export function useAdminPerformance() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    renderTime: 0,
    apiCalls: 0,
    errors: 0
  });

  const pageLoadStart = useRef<number>(Date.now());
  const renderStart = useRef<number>(Date.now());

  useEffect(() => {
    const pageLoadTime = Date.now() - pageLoadStart.current;
    const renderTime = Date.now() - renderStart.current;

    setMetrics(prev => ({
      ...prev,
      pageLoadTime,
      renderTime
    }));
  }, []);

  const trackApiCall = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      apiCalls: prev.apiCalls + 1
    }));
  }, []);

  const trackError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      errors: prev.errors + 1
    }));
  }, []);

  return {
    metrics,
    trackApiCall,
    trackError
  };
}

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Local storage hook with automatic serialization
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Virtual scrolling hook for large lists
interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const scrollElementProps = {
    onScroll: useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []),
    style: {
      height: containerHeight,
      overflow: 'auto'
    }
  };

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    scrollElementProps
  };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Lazy loading component hook
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load component');
        setLoading(false);
      });
  }, [importFunc]);

  const LazyComponent = component || fallback;

  return {
    LazyComponent,
    loading,
    error
  };
}

// Responsive breakpoints hook
export function useBreakpoints() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop
  };
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// File upload progress hook
export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = useCallback(async (
    file: File,
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<string>
  ) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const result = await uploadFunction(file, (progressValue) => {
        setProgress(progressValue);
      });

      setProgress(100);
      setSuccess(true);
      setUploading(false);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    progress,
    uploading,
    error,
    success,
    uploadFile,
    reset
  };
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts(
  shortcuts: Record<string, () => void>
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = [];

      if (event.ctrlKey || event.metaKey) key.push('ctrl');
      if (event.shiftKey) key.push('shift');
      if (event.altKey) key.push('alt');

      key.push(event.key.toLowerCase());
      const shortcut = key.join('+');

      const handler = shortcuts[shortcut];
      if (handler && typeof handler === 'function') {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

// Optimized pagination hook
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    currentItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}