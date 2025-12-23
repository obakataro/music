const CACHE_NAME = 'dsp-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CDN fonts/icons (optional) - if you use different paths, adjust
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE_NAME) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  // network-first for index.html, cache-first for others
  if(req.mode === 'navigate'){
    ev.respondWith(
      fetch(req).catch(()=> caches.match('/'))
    );
    return;
  }
  ev.respondWith(
    caches.match(req).then(r => r || fetch(req).catch(()=>{}))
  );
});
