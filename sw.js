/* 旧 PWA（Service Worker）の後始末用キルスイッチ。
 * 以前このサイトを開いた端末に残っている Service Worker と古いキャッシュを
 * 解除・削除し、以降は常に最新版をネットワークから配信させる。
 * 新規訪問者はどのページからも SW を登録しないため、これは無害（既存登録の掃除専用）。
 * 掃除が行き渡ったら将来的に削除してよい。 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));   // 旧キャッシュを全削除
    await self.registration.unregister();                   // 自分自身を登録解除
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));               // 開いているタブを最新版で再読込
  })());
});
