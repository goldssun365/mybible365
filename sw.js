/* 2026-10-10: 주니어 앱 파일이 잘못 맨 바깥에 올라갔을 때 등록된 오프라인 저장을 풀어 주는 파일.
   맨 바깥 첫 화면은 오프라인 저장을 쓰지 않으므로, 이 파일은 등록을 스스로 풀고 페이지를 새로 엶. 지우지 말고 그대로 둘 것 */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  await self.registration.unregister();
  const cs=await self.clients.matchAll({type:'window'});
  cs.forEach(c=>{try{c.navigate(c.url)}catch(err){}});
})()));
