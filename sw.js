// Minimalny SW - iba splni Chrome PWA poziadavku, NEZACHYTAVA pozadnavky
// Ziadne offline caching - vsetko ide priamo na server
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
  // Nic nerob - prehliadac sa postara sam (network-only behavior)
});
