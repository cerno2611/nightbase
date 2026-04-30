// Minimal SW pre PWA install - nezachytava nic, ale fetch event existuje
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  // Network-first - vsetko ide priamo na server
  e.respondWith(fetch(e.request).catch(() => new Response('Offline', {status: 503})));
});
