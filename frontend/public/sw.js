// Service worker minimal untuk PWA (installable + cache app shell).
const CACHE = 'cdm-v1';
const SHELL = ['/', '/katalog', '/index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // API: selalu network (jangan cache data dinamis)
  if (url.pathname.startsWith('/api/')) return;
  // Navigasi: network-first, fallback ke cache (offline)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match(req).then((r) => r || caches.match('/index.html'))));
    return;
  }
  // Aset statis: cache-first
  e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
    return res;
  }).catch(() => r)));
});
