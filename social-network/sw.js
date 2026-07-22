/**
 * SocialNet - Service Worker v1.0
 * Premium Social Network Platform
 * PWA Support
 */

const CACHE_NAME = 'socialnet-v1';
const STATIC_CACHE = 'socialnet-static-v1';
const DYNAMIC_CACHE = 'socialnet-dynamic-v1';
const IMMUTABLE_CACHE = 'socialnet-immutable-v1';

// Assets to precache
const PRECACHE_URLS = [
  '/',
  '/login',
  '/register',
  '/assets/css/app.css',
  '/assets/css/design-system.css',
  '/assets/css/responsive.css',
  '/assets/js/app.js',
  '/manifest.json',
  '/offline',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE &&
                   name !== DYNAMIC_CACHE &&
                   name !== IMMUTABLE_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: is CDN / external resource
function isExternalResource(url) {
  return url.origin !== self.location.origin;
}

// Helper: is API call
function isApiCall(url) {
  return url.pathname.startsWith('/api/');
}

// Helper: is immutable (hashed) asset
function isImmutable(url) {
  return /\.(?:js|css|woff2?|ttf|eot)(?:\?.*)?$/.test(url.pathname) &&
         (url.pathname.includes('cdn') || url.pathname.includes('cloudflare'));
}

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls (network only)
  if (isApiCall(url)) return;

  // Immutable CDN resources: cache first
  if (isImmutable(url) || isExternalResource(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const cloned = response.clone();
          caches.open(IMMUTABLE_CACHE).then((cache) => {
            cache.put(request, cloned);
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML pages: Network first, cache fallback, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, cloned);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Static assets: Cache first, update in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, cloned);
          });
        }
        return response;
      });

      return cached || fetchPromise;
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body || 'Nova notificação',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        id: data.id,
      },
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'close', title: 'Fechar' },
      ],
      tag: data.tag || 'default',
      renotify: true,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'SocialNet', options)
    );
  } catch (e) {
    console.error('Push notification error:', e);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url === url);
      if (existing) {
        existing.focus();
        return;
      }
      return clients.openWindow(url);
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
});

async function syncPendingPosts() {
  // Logic to sync pending posts when back online
  const db = await openIndexedDB();
  const posts = await db.getAll('pending-posts');
  for (const post of posts) {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      await db.delete('pending-posts', post.id);
    } catch (e) {
      console.error('Sync failed for post:', post.id);
    }
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SocialNetDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-posts')) {
        db.createObjectStore('pending-posts', { keyPath: 'id' });
      }
    };
  });
}
