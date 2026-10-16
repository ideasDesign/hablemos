const CACHE='hablemos-offline-v6';
const FILES=['./','./index.html','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
// Primero la red, para que siempre se use la última versión publicada (así no conviven versiones viejas y nuevas).
// Si no hay internet o la red tarda más de 3 segundos, se usa la copia guardada.
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const network=fetch(request.mode==='navigate'?request.url:request,{cache:'no-cache'}).then(response=>{
      if(response.ok)cache.put(request,response.clone());
      return response;
    });
    const cached=await cache.match(request,{ignoreSearch:true});
    if(!cached)return network;
    return Promise.race([network.catch(()=>cached),new Promise(resolve=>setTimeout(()=>resolve(cached),3000))]);
  })());
});
