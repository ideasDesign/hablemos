const CACHE='hablemos-offline-v20';
const PICTOS_CACHE='hablemos-pictos';
const FILES=['./','./index.html','./app.js','./pictos.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key!==PICTOS_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
// Primero la red, para que siempre se use la última versión publicada (así no conviven versiones viejas y nuevas).
// Si no hay internet o la red tarda más de 3 segundos, se usa la copia guardada.
self.addEventListener('fetch',event=>{
  const request=event.request;
  // Pictogramas de ARASAAC: se guardan la primera vez y después funcionan sin internet.
  if(request.method==='GET'&&request.url.startsWith('https://static.arasaac.org/pictograms/')){
    event.respondWith(caches.open(PICTOS_CACHE).then(async cache=>{
      const hit=await cache.match(request,{ignoreVary:true});if(hit)return hit;
      const response=await fetch(request);cache.put(request,response.clone()).catch(()=>{});return response;
    }));
    return;
  }
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
// Avisos de mensajes nuevos (push): se muestran aunque Hablemos esté cerrada.
// Si la app ya está en pantalla, el aviso entra sin sonido, porque la app ya suena, vibra y lo lee en voz alta.
// El aviso de prueba siempre suena, para poder comprobar que funciona.
// Importante: un aviso sin sonido no puede llevar vibración (el navegador lo rechaza y no muestra nada).
self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch(e){data={body:event.data?event.data.text():''};}
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const visible=windows.some(c=>c.visibilityState==='visible');
    for(const c of windows)c.postMessage({type:'hablemos-push'});
    const silent=visible&&data.tag!=='test';
    const options={
      body:data.body||'Tenés un mensaje nuevo.',
      icon:'./assets/icon-192.png',badge:'./assets/icon-192.png',
      tag:data.tag||'hablemos',renotify:true,silent,
      data:{url:'./index.html'}
    };
    if(!silent)options.vibrate=[300,120,300];
    try{await self.registration.showNotification(data.title||'Hablemos',options);}
    catch(e){await self.registration.showNotification(data.title||'Hablemos',{body:options.body,icon:options.icon,tag:options.tag});}
  })());
});
// Al tocar el aviso: abre Hablemos (o la trae al frente si ya estaba abierta).
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const mine=windows.find(c=>new URL(c.url).pathname.startsWith(new URL(self.registration.scope).pathname));
    if(mine){await mine.focus();mine.postMessage({type:'hablemos-push'});return;}
    await self.clients.openWindow(new URL('./index.html',self.registration.scope).href);
  })());
});
