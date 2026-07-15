const CACHE = 'la-v5';
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(['/app-v2.html','/manifest-v2.json'])).then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch', e => {
  if(e.request.url.includes('anthropic.com')||e.request.url.includes('googleapis.com')||e.request.url.includes('emailjs.com'))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.status===200){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}
    return res;
  })));
});
