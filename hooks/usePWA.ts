'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  // Check if PWA is installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');

      // Check if app is already installed
      const isInAppBrowser = /wv|iPhone|iPod/.test(navigator.userAgent) &&
                           / Instagram|Facebook|WhatsApp|Twitter/.test(navigator.userAgent);

      setIsInstalled(isStandalone || isInAppBrowser);
    };

    checkInstalled();

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Show install prompt after delay and conditions
      const shouldShowPrompt = () => {
        const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
        const lastDismissal = localStorage.getItem('pwa-prompt-dismissed');

        // Don't show if installed
        if (isInstalled) return false;

        // Don't show if dismissed recently (within 7 days)
        if (lastDismissal) {
          const daysSinceDismissal = (Date.now() - parseInt(lastDismissal)) / (1000 * 60 * 60 * 24);
          if (daysSinceDismissal < 7) return false;
        }

        // Don't show if already seen and dismissed multiple times
        if (hasSeenPrompt && parseInt(dismissCount.toString()) >= 3) return false;

        // Show after user has spent some time on the site
        setTimeout(() => {
          if (!isInstalled && !localStorage.getItem('pwa-prompt-permanently-dismissed')) {
            setShowInstallPrompt(true);
          }
        }, 30000); // 30 seconds

        return true;
      };

      shouldShowPrompt();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled, dismissCount]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('PWA installation prompt not available');
      return false;
    }

    setIsLoading(true);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation prompt');
        setIsInstalled(true);
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-installed', Date.now().toString());
        return true;
      } else {
        console.log('User dismissed the PWA installation prompt');
        setDismissCount(prev => prev + 1);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());

        // Permanently dismiss after 3 dismissals
        if (dismissCount >= 2) {
          localStorage.setItem('pwa-prompt-permanently-dismissed', 'true');
        }
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    } finally {
      setIsLoading(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, dismissCount]);

  const dismiss = useCallback(() => {
    setShowInstallPrompt(false);
    setDismissCount(prev => prev + 1);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());

    // Permanently dismiss after 3 dismissals
    if (dismissCount >= 2) {
      localStorage.setItem('pwa-prompt-permanently-dismissed', 'true');
    }
  }, [dismissCount]);

  const canInstall = Boolean(deferredPrompt && !isInstalled);
  const shouldShowInstallPrompt = showInstallPrompt && !isInstalled && canInstall;

  return {
    canInstall,
    isInstalled,
    isLoading,
    showInstallPrompt: shouldShowInstallPrompt,
    install,
    dismiss,
    deferredPrompt
  };
}

// Utility hook for offline detection
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOffline(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);
    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline };
}

// Utility hook for device detection
export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    supportsTouch: false,
    supportsInstall: false,
    pixelRatio: 1,
    screenWidth: 0,
    screenHeight: 0
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const ua = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDeviceInfo({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
        isChrome: /Chrome/.test(ua),
        supportsTouch: 'ontouchstart' in window,
        supportsInstall: 'beforeinstallprompt' in window,
        pixelRatio: window.devicePixelRatio || 1,
        screenWidth: width,
        screenHeight: height
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Utility hook for network quality
export function useNetworkQuality() {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection ||
                         (navigator as any).mozConnection ||
                         (navigator as any).webkitConnection;

      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false
        });

        connection.addEventListener('change', updateNetworkInfo);
      }
    };

    updateNetworkInfo();

    return () => {
      const connection = (navigator as any).connection ||
                         (navigator as any).mozConnection ||
                         (navigator as any).webkitConnection;

      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return networkInfo;
}

// Utility hook for swipe gestures
export function useSwipeGestures(
  element: HTMLElement | null,
  options: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
  } = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50
  } = options;

  useEffect(() => {
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if swipe is significant enough
      if (Math.max(absDeltaX, absDeltaY) > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);
}