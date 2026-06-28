// Service worker PWA — strategi "online selalu segar, cache hanya jaring offline".
// Hindari menyajikan bundle lama: navigasi & HTML selalu network-first.
const CACHE = 'cdm-v2'; // naikkan versi → cache lama otomatis dibersihkan saat activate

self.addEventListener('install', (e) => {
  // Aktifkan SW baru segera (jangan menunggu tab lama tertutup).
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.add('/index.html')).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API: selalu jaringan, jangan pernah cache data dinamis.
  if (url.pathname.startsWith('/api/')) return;

  // Navigasi / dokumen HTML: network-first → online selalu dapat index.html terbaru
  // (yang mereferensikan hash aset terbaru). Fallback cache hanya saat offline.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Aset ber-hash (/assets/index-XXXX.js|css): nama unik per build → cache-first aman & cepat.
  // Aset lain: stale-while-revalidate ringan.
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
