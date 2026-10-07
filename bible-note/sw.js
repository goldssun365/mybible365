/* 성경필사노트 오프라인 저장 (2026-10-07)
   인터넷이 되면 늘 서버의 최신 판을 쓰고(바뀐 게 없으면 304로 가볍게 확인), 안 되면 저장해 둔 판을 엽니다.
   그래서 새 판을 올려도 사용자가 따로 할 일이 없습니다. */
const C='bible-note-v1';
const CORE=['./','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('bible-note-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  const nav=req.mode==='navigate';
  const key=nav?new URL('./',self.registration.scope).href:req;
  e.respondWith((async()=>{
    const cache=await caches.open(C);
    try{
      const res=await fetch(nav?new Request(req.url,{cache:'no-cache',credentials:'same-origin'}):new Request(req,{cache:'no-cache'}));
      if(res.ok&&!res.redirected)cache.put(key,res.clone());
      return res;
    }catch(err){
      const hit=await cache.match(key)||await cache.match(req,{ignoreSearch:true});
      if(hit)return hit;
      return new Response('<meta charset=utf-8><p style="font:20px sans-serif;padding:30px">인터넷에 연결된 상태에서 한 번 열어 주세요. 그다음부터는 인터넷 없이도 열립니다.</p>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
    }
  })());
});
