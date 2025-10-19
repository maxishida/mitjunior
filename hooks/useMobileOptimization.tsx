'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TouchGesture {
  startX: number;
  startY: number;
  startTime: number;
  endX: number;
  endY: number;
  endTime: number;
  type: 'swipe' | 'tap' | 'longpress' | 'pinch';
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

interface MobileViewport {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

interface TouchActions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
}

export function useMobileOptimization() {
  const [viewport, setViewport] = useState<MobileViewport>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'portrait'
  });

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [supportsPassiveEvents, setSupportsPassiveEvents] = useState(false);

  // Update viewport information
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      const orientation = width > height ? 'landscape' : 'portrait';

      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        orientation
      });
    };

    // Check for touch support
    const checkTouchSupport = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);

      // Check for passive event support
      let passiveSupported = false;
      try {
        const options = Object.defineProperty({}, 'passive', {
          get: () => {
            passiveSupported = true;
            return true;
          }
        });
        window.addEventListener('test', null as any, options);
        window.removeEventListener('test', null as any, options);
      } catch (err) {
        passiveSupported = false;
      }
      setSupportsPassiveEvents(passiveSupported);
    };

    updateViewport();
    checkTouchSupport();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  // Touch gesture detection
  const useTouchGestures = useCallback((
    elementRef: React.RefObject<HTMLElement>,
    actions: TouchActions,
    options: {
      swipeThreshold?: number;
      longPressDelay?: number;
      preventDefault?: boolean;
    } = {}
  ) => {
    const {
      swipeThreshold = 50,
      longPressDelay = 500,
      preventDefault = true
    } = options;

    const touchState = useRef<TouchGesture>({
      startX: 0,
      startY: 0,
      startTime: 0,
      endX: 0,
      endY: 0,
      endTime: 0,
      type: 'tap'
    });

    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();

      const touch = e.touches[0];
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        endX: touch.clientX,
        endY: touch.clientY,
        endTime: Date.now(),
        type: 'tap'
      };

      // Start long press timer
      longPressTimer.current = setTimeout(() => {
        touchState.current.type = 'longpress';
        actions.onLongPress?.();
      }, longPressDelay);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();

      const touch = e.touches[0];
      touchState.current.endX = touch.clientX;
      touchState.current.endY = touch.clientY;

      // Cancel long press if moved too much
      const deltaX = Math.abs(touch.clientX - touchState.current.startX);
      const deltaY = Math.abs(touch.clientY - touchState.current.startY);

      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();

      const touch = e.changedTouches[0];
      const state = touchState.current;
      state.endX = touch.clientX;
      state.endY = touch.clientY;
      state.endTime = Date.now();

      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      const deltaX = state.endX - state.startX;
      const deltaY = state.endY - state.startY;
      const deltaTime = state.endTime - state.startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Determine gesture type
      if (distance < 10 && deltaTime < 200) {
        // Tap
        state.type = 'tap';
        actions.onTap?.();
      } else if (distance > swipeThreshold && deltaTime < 500) {
        // Swipe
        state.type = 'swipe';
        state.distance = distance;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          state.direction = deltaX > 0 ? 'right' : 'left';
          if (deltaX > 0) {
            actions.onSwipeRight?.();
          } else {
            actions.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          state.direction = deltaY > 0 ? 'down' : 'up';
          if (deltaY > 0) {
            actions.onSwipeDown?.();
          } else {
            actions.onSwipeUp?.();
          }
        }
      }
    };

    useEffect(() => {
      const element = elementRef.current;
      if (!element || !isTouchDevice) return;

      const eventOptions = supportsPassiveEvents ? { passive: false } : false;

      element.addEventListener('touchstart', handleTouchStart, eventOptions as any);
      element.addEventListener('touchmove', handleTouchMove, eventOptions as any);
      element.addEventListener('touchend', handleTouchEnd, eventOptions as any);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);

        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
        }
      };
    }, [elementRef, actions, isTouchDevice, supportsPassiveEvents]);
  }, [isTouchDevice, supportsPassiveEvents]);

  // Haptic feedback
  const triggerHaptic = useCallback((
    type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'
  ) => {
    if (!isTouchDevice || !('vibrate' in navigator)) return;

    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100],
      success: [10, 50, 10],
      warning: [50, 50, 50],
      error: [100, 50, 100]
    };

    navigator.vibrate(patterns[type]);
  }, [isTouchDevice]);

  // Safe area handling
  const getSafeAreaInsets = useCallback(() => {
    if (typeof window === 'undefined' || !window.getComputedStyle) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    const rootStyle = window.getComputedStyle(document.documentElement);
    const safeAreaTop = parseInt(rootStyle.getPropertyValue('--safe-area-inset-top') || '0');
    const safeAreaRight = parseInt(rootStyle.getPropertyValue('--safe-area-inset-right') || '0');
    const safeAreaBottom = parseInt(rootStyle.getPropertyValue('--safe-area-inset-bottom') || '0');
    const safeAreaLeft = parseInt(rootStyle.getPropertyValue('--safe-area-inset-left') || '0');

    return {
      top: safeAreaTop,
      right: safeAreaRight,
      bottom: safeAreaBottom,
      left: safeAreaLeft
    };
  }, []);

  // Responsive breakpoints
  const isBreakpoint = useCallback((breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    const breakpoints = {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    };

    return viewport.width >= breakpoints[breakpoint];
  }, [viewport.width]);

  // Touch-friendly interactions
  const getTouchProps = useCallback((
    baseProps: React.HTMLAttributes<HTMLElement> = {},
    options: {
      scale?: boolean;
      highlight?: boolean;
      haptic?: 'light' | 'medium' | 'heavy';
    } = {}
  ) => {
    const { scale = true, highlight = true, haptic } = options;

    return {
      ...baseProps,
      className: [
        baseProps.className,
        'touch-manipulation',
        scale && 'active:scale-95',
        highlight && 'active:bg-opacity-10',
        'transition-transform',
        'transition-colors',
        'duration-150',
        'ease-in-out'
      ].filter(Boolean).join(' '),
      onTouchStart: (e: React.TouchEvent) => {
        if (haptic) triggerHaptic(haptic);
        baseProps.onTouchStart?.(e);
      }
    };
  }, [triggerHaptic]);

  // Prevent scroll bounce
  const preventScrollBounce = useCallback((element: HTMLElement) => {
    if (!isTouchDevice) return;

    let startY = 0;
    let startTopScroll = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].pageY;
      startTopScroll = element.scrollTop;

      if (startTopScroll <= 0) {
        element.scrollTop = 1;
      }
      if (startTopScroll + element.offsetHeight >= element.scrollHeight) {
        element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].pageY;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const height = element.offsetHeight;
      const isTop = startY <= y && scrollTop === 0;
      const isBottom = startY >= y && scrollTop + height >= scrollHeight;

      if (isTop || isBottom) {
        e.preventDefault();
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTouchDevice]);

  // Pull to refresh
  const usePullToRefresh = useCallback((
    containerRef: React.RefObject<HTMLElement>,
    onRefresh: () => Promise<void>,
    options: {
      threshold?: number;
      resistance?: number;
    } = {}
  ) => {
    const { threshold = 80, resistance = 2.5 } = options;
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const startY = useRef(0);
    const currentY = useRef(0);

    const handleTouchStart = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      startY.current = e.touches[0].pageY;
      currentY.current = startY.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      currentY.current = e.touches[0].pageY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        e.preventDefault();
        const distance = deltaY / resistance;
        setPullDistance(Math.min(distance, threshold * 1.5));
        setIsPulling(distance > threshold);
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !isTouchDevice) return;

      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }, [containerRef, isTouchDevice, onRefresh]);

    return {
      isPulling,
      pullDistance,
      isRefreshing,
      pullStyle: {
        transform: `translateY(${pullDistance}px)`,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }
    };
  }, [isTouchDevice]);

  return {
    // Viewport info
    viewport,
    isMobile: viewport.isMobile,
    isTablet: viewport.isTablet,
    isDesktop: viewport.isDesktop,
    isTouchDevice,
    supportsPassiveEvents,

    // Breakpoint helpers
    isBreakpoint,

    // Touch utilities
    useTouchGestures,
    getTouchProps,
    preventScrollBounce,
    usePullToRefresh,

    // Haptic feedback
    triggerHaptic,

    // Safe area
    getSafeAreaInsets,

    // Responsive utilities
    getResponsiveValue: function <T>(values: Partial<Record<'mobile' | 'tablet' | 'desktop', T>>, defaultValue: T): T {
      if (viewport.isMobile && values.mobile !== undefined) return values.mobile;
      if (viewport.isTablet && values.tablet !== undefined) return values.tablet;
      if (viewport.isDesktop && values.desktop !== undefined) return values.desktop;
      return defaultValue;
    }
  };
}