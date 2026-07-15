const CACHE = 'la-v8';
const BASE = '/Devis-loire-amenagement.com';

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll([
    BASE+'/',
    BASE+'/index.html',
    BASE+'/manifest-v2.json',
    BASE+'/sw-v2.js'
  ])).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())
));

self.addEventListener('fetch', e => {
  if(e.request.url.includes('googleapis.com')||e.request.url.includes('anthropic.com')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if(res&&res.status===200) {
        const c=res.clone();
        caches.open(CACHE).then(cache=>cache.put(e.request,c));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
