const CACHE_NAME = 'comunidadeflix-v1.0.0';
const STATIC_CACHE_NAME = 'comunidadeflix-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'comunidadeflix-dynamic-v1.0.0';
const RUNTIME_CACHE_NAME = 'comunidadeflix-runtime-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/app',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/app/_not-found.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png'
];

const API_CACHE_ROUTES = [
  /^\/api\/courses/,
  /^\/api\/user/,
  /^\/api\/progress/
];

const DYNAMIC_CACHE_ROUTES = [
  /^\/app\//,
  /^\/cursos\//,
  /^\/api\/courses/,
  /^\/api\/user/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event triggered');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event triggered');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME &&
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     cacheName !== RUNTIME_CACHE_NAME &&
                     !cacheName.includes('v1.0.0');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Failed to clean up old caches:', error);
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except specific CDN domains)
  if (url.origin !== self.location.origin &&
      !url.hostname.includes('cdnjs.cloudflare.com') &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // Handle different request types
  if (isStaticAsset(request.url)) {
    // Cache static assets with Network First strategy
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE_NAME));
  } else if (shouldCacheDynamically(request.url)) {
    // Cache dynamic content with Network First strategy
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
  } else if (isAPIRequest(request.url)) {
    // Cache API responses with Network First strategy and short TTL
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE_NAME, 5 * 60 * 1000)); // 5 minutes
  } else {
    // Use Network First for all other requests
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network First strategy
async function networkFirstStrategy(request, cacheName = null, maxAge = null) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok && cacheName) {
      const cache = await caches.open(cacheName);

      // Clone response before caching
      const responseToCache = networkResponse.clone();

      // Add timestamp for cache invalidation
      const cacheEntry = {
        response: responseToCache,
        timestamp: Date.now()
      };

      await cache.put(request, cacheEntry);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);

    if (cacheName) {
      const cachedResponse = await getCachedResponse(request, cacheName, maxAge);

      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }

    // Return error for other requests
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache First strategy for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkFetch = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkFetch;
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('/icons/') ||
         url.includes('/images/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('.ttf') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.png') ||
         url.includes('.gif') ||
         url.includes('.webp') ||
         url.includes('.svg') ||
         url.includes('/manifest.json');
}

function shouldCacheDynamically(url) {
  return DYNAMIC_CACHE_ROUTES.some(route => route.test(url));
}

function isAPIRequest(url) {
  return API_CACHE_ROUTES.some(route => route.test(url)) || url.includes('/api/');
}

async function getCachedResponse(request, cacheName, maxAge = null) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (!cached) {
    return null;
  }

  // Check cache age if maxAge is specified
  if (maxAge) {
    const cacheEntry = await cache.match(request + '-meta');

    if (cacheEntry) {
      const meta = await cacheEntry.json();
      const age = Date.now() - meta.timestamp;

      if (age > maxAge) {
        await cache.delete(request);
        await cache.delete(request + '-meta');
        return null;
      }
    }
  }

  return cached;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get all pending actions from IndexedDB
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      try {
        // Retry the failed request
        await fetch(action.url, action.options);

        // Remove successful action from pending queue
        await removePendingAction(action.id);
      } catch (error) {
        console.error('[SW] Background sync failed for action:', action.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do ComunidadeFlix',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ],
    silent: false,
    requireInteraction: false,
    tag: 'comunidadeflix-notification'
  };

  event.waitUntil(
    self.registration.showNotification('ComunidadeFlix', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to relevant page
    event.waitUntil(
      clients.openWindow('/app')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll()
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/app');
          }
        })
    );
  }
});

// IndexedDB helpers for offline queue
async function getPendingActions() {
  // This would typically use IndexedDB to store pending actions
  // For now, returning empty array
  return [];
}

async function removePendingAction(id) {
  // This would remove the action from IndexedDB
  console.log('[SW] Removing pending action:', id);
}

// Cleanup caches on storage quota exceeded
self.addEventListener('quotaexceeded', (event) => {
  console.log('[SW] Storage quota exceeded, cleaning up old caches');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.includes('runtime'))
            .map((cacheName) => {
              console.log('[SW] Deleting cache due to quota exceeded:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Update specific cache
    const { url, cacheName } = event.data;

    caches.open(cacheName || DYNAMIC_CACHE_NAME)
      .then((cache) => {
        return cache.delete(url);
      })
      .then(() => {
        console.log('[SW] Cache updated for:', url);
      });
  }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const start = performance.now();

  event.waitUntil(
    fetch(event.request)
      .then((response) => {
        const duration = performance.now() - start;

        // Log slow requests
        if (duration > 2000) {
          console.warn('[SW] Slow request detected:', event.request.url, `${duration.toFixed(2)}ms`);
        }

        return response;
      })
      .catch((error) => {
        const duration = performance.now() - start;
        console.error('[SW] Request failed:', event.request.url, `${duration.toFixed(2)}ms`, error);
        throw error;
      })
  );
});

console.log('[SW] Service Worker initialized');