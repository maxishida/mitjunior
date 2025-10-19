'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce, throttle } from 'lodash-es';

interface PerformanceMetrics {
  renderTime: number;
  componentRenders: number;
  memoryUsage?: number;
  lastInteractionTime: number;
}

interface OptimizationOptions {
  enableVirtualization?: boolean;
  lazyLoading?: boolean;
  debouncingMs?: number;
  throttlingMs?: number;
  maxRetries?: number;
  cacheSize?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function usePerformanceOptimization<T = any>(
  options: OptimizationOptions = {}
) {
  const {
    enableVirtualization = false,
    lazyLoading = false,
    debouncingMs = 300,
    throttlingMs = 100,
    maxRetries = 3,
    cacheSize = 100
  } = options;

  // Performance metrics
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentRenders: 0,
    lastInteractionTime: Date.now()
  });

  // Cache for expensive operations
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const retryCountRef = useRef<Map<string, number>>(new Map());

  // Render performance tracking
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;

    setMetrics(prev => ({
      ...prev,
      renderTime,
      componentRenders: prev.componentRenders + 1
    }));

    renderStartTime.current = Date.now();
  });

  // Cache management
  const setCache = useCallback((key: string, data: T, ttl: number = 300000) => {
    const cache = cacheRef.current;

    // Clean old entries if cache is full
    if (cache.size >= cacheSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, [cacheSize]);

  const getCache = useCallback((key: string): T | null => {
    const cache = cacheRef.current;
    const entry = cache.get(key);

    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    retryCountRef.current.clear();
  }, []);

  // Debounced function wrapper
  const useDebounced = useCallback(<Args extends any[]>(
    fn: (...args: Args) => void,
    ms: number = debouncingMs
  ) => {
    return debounce(fn, ms);
  }, [debouncingMs]);

  // Throttled function wrapper
  const useThrottled = useCallback(function <Args extends any[]>(
    fn: (...args: Args) => void,
    ms: number = throttlingMs
  ) {
    return throttle(fn, ms);
  }, [throttlingMs]);

  // Retry mechanism for failed operations
  const withRetry = useCallback(async function <R>(
    operation: () => Promise<R>,
    operationKey: string,
    retries: number = maxRetries
  ): Promise<R> {
    const retryCount = retryCountRef.current.get(operationKey) || 0;

    try {
      const result = await operation();
      retryCountRef.current.delete(operationKey);
      return result;
    } catch (error) {
      if (retryCount < retries) {
        retryCountRef.current.set(operationKey, retryCount + 1);

        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        return withRetry(operation, operationKey, retries);
      }

      retryCountRef.current.delete(operationKey);
      throw error;
    }
  }, [maxRetries]);

  // Virtual scrolling for large lists
  const useVirtualization = useCallback(function <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    scrollTop: number = 0
  ) {
    if (!enableVirtualization || items.length === 0) {
      return {
        visibleItems: items,
        startIndex: 0,
        endIndex: items.length - 1,
        offsetY: 0,
        totalHeight: items.length * itemHeight
      };
    }

    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length - 1);
    const offsetY = startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      startIndex,
      endIndex,
      offsetY,
      totalHeight
    };
  }, [enableVirtualization]);

  // Lazy loading for images and components
  const useLazyLoad = useCallback((
    elementRef: React.RefObject<HTMLElement>,
    onIntersect: () => void
  ) => {
    if (!lazyLoading || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [lazyLoading]);

  // Memoized data processing
  const useMemoizedData = useCallback((
    data: T[],
    processor: (item: T) => any,
    dependencies: any[] = []
  ) => {
    return useMemo(() => {
      const startTime = Date.now();
      const result = data.map(processor);
      const endTime = Date.now();

      setMetrics(prev => ({
        ...prev,
        lastInteractionTime: endTime
      }));

      return result;
    }, [data, processor, ...dependencies]);
  }, []);

  // Batch state updates
  const useBatchedUpdates = useCallback((
    updates: Array<() => void>,
    batchMs: number = 16
  ) => {
    updates.forEach(update => {
      setTimeout(update, batchMs);
    });
  }, []);

  // Memory leak prevention
  const useMemoryCleanup = useCallback(() => {
    // Clear caches
    clearCache();

    // Cancel pending timeouts/intervals
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  }, [clearCache]);

  // Performance monitoring
  const getPerformanceReport = useCallback(() => {
    return {
      metrics,
      cacheSize: cacheRef.current.size,
      memoryUsage: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }, [metrics]);

  return {
    // Performance metrics
    metrics,
    getPerformanceReport,

    // Cache utilities
    setCache,
    getCache,
    clearCache,

    // Function wrappers
    useDebounced,
    useThrottled,
    withRetry,

    // Performance features
    useVirtualization,
    useLazyLoad,
    useMemoizedData,
    useBatchedUpdates,
    useMemoryCleanup,

    // Utilities
    updateInteractionTime: useCallback(() => {
      setMetrics(prev => ({
        ...prev,
        lastInteractionTime: Date.now()
      }));
    }, [])
  };
}

// Specific performance hooks for common use cases

export function useVirtualScroll<T = any>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const { useVirtualization } = usePerformanceOptimization({
    enableVirtualization: true
  });

  const virtualizedData = useVirtualization(items, itemHeight, containerHeight, scrollTop);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    ...virtualizedData,
    handleScroll,
    scrollElementProps: {
      onScroll: handleScroll,
      style: { height: containerHeight, overflow: 'auto' }
    }
  };
}

export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { useLazyLoad } = usePerformanceOptimization({
    lazyLoading: true
  });

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setError(null);
    };

    img.onerror = () => {
      setError(new Error('Failed to load image'));
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  useLazyLoad(imgRef, () => {
    if (src) {
      setImageSrc(src);
    }
  });

  return {
    ref: imgRef,
    src: imageSrc,
    isLoading,
    error,
    loaded: !!imageSrc
  };
}

export function useOptimizedSearch<T = any>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);

  const { useDebounced, useMemoizedData } = usePerformanceOptimization({
    debouncingMs: debounceMs
  });

  const debouncedSearch = useDebounced((searchQuery: string) => {
    setIsSearching(true);

    const searchResults = items.filter(item => searchFn(item, searchQuery));
    setResults(searchResults);
    setIsSearching(false);
  }, debounceMs);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, items, debouncedSearch]);

  const memoizedResults = useMemoizedData(
    results,
    (item) => item,
    [query]
  );

  return {
    query,
    setQuery,
    results: memoizedResults,
    isSearching,
    clearSearch: () => {
      setQuery('');
      setResults(items);
    }
  };
}

export function useInfiniteScroll<T = any>(
  fetchMore: (page: number) => Promise<T[]>,
  options: {
    threshold?: number;
    initialPage?: number;
    pageSize?: number;
  } = {}
) {
  const {
    threshold = 0.8,
    initialPage = 1,
    pageSize = 20
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState<Error | null>(null);

  const { withRetry } = usePerformanceOptimization();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await withRetry(
        () => fetchMore(page),
        `infinite-scroll-page-${page}`
      );

      if (newItems.length < pageSize) {
        setHasMore(false);
      }

      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchMore, pageSize, withRetry]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        threshold
      }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, threshold, loadMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    items,
    loading,
    hasMore,
    error,
    lastElementRef,
    loadMore,
    reset
  };
}