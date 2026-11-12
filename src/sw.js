// Service worker: makes Vaani installable and usable offline.
const VERSION = 'vaani-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'js/main.js', 'js/pwa.js', 'js/config.js', 'js/geometry.js', 'js/tracker.js', 'js/classifier.js',
  'js/signs.js', 'js/twoHand.js', 'js/stabilizer.js', 'js/camera.js', 'js/renderer.js', 'js/ui.js', 'js/textBuffer.js',
  'icons/logo.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const store = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const mediapipe = url.pathname.includes('/vendor/mediapipe/') || url.hostname === 'cdn.jsdelivr.net';
  if (!sameOrigin && !mediapipe) return;

  if (mediapipe) {
    // Big model/wasm files: cache first, download once.
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => store(req, res))));
    return;
  }

  // App files: network first (updates show up), cache when offline.
  e.respondWith(
    fetch(req).then(res => store(req, res)).catch(() =>
      caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    )
  );
});
