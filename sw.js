// Nettverk først, lagret kopi når det ikke er dekning. innhold.json hentes alltid fra nettet.
const C="prosjektlogg-v1";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  const nokkel=url.pathname.endsWith("innhold.json")?url.pathname:e.request;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{ const c=r.clone(); caches.open(C).then(x=>x.put(nokkel,c)); return r; })
    .catch(()=>caches.match(nokkel)));
});
