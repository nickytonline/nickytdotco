// This service worker unregisters itself and clears all caches
// It's a cleanup script for removing the old service worker

self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      // Unregister this service worker
      await self.registration.unregister();

      // Take control of all clients immediately
      await self.clients.claim();

      // Reload all clients to ensure they're no longer controlled by a service worker
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.navigate(client.url);
      });
    })()
  );
});

// Don't handle any fetch events - pass them through
self.addEventListener('fetch', () => {
  // Do nothing - let requests pass through
});
