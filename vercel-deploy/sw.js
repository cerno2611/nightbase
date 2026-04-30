const CACHE = 'nightbase-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      fetch('/nightbase-preview.html')
        .then(r => c.put('/nightbase-preview.html', r))
        .catch(() => {})
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Pre navigáciu (otvorenie appky) vždy vráť hlavný HTML
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('/nightbase-preview.html'))
    );
    return;
  }

  // Pre ostatné requesty — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request)
        .then(res => {
          if (res && res.ok && res.type === 'basic') {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match('/nightbase-preview.html'));
    })
  );
});
