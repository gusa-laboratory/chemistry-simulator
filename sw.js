/* 化学シミュレーター Service Worker
 * ⚠️ HTML/JS/アイコンを変更したら CACHE のバージョン番号を必ず上げること。
 *    上げ忘れると利用者端末に旧版が残り続ける（badminton系と同じ運用）。
 */
const CACHE = 'chem-sim-v2';
const ASSETS = [
  './',
  './index.html',
  './gas-laws.html',
  './solutions.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

// インストール時にアプリシェルを事前キャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 有効化時に古いバージョンのキャッシュを掃除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// cache-first（オフライン教室優先）。取得できたGET応答は同一オリジンのみ追記キャッシュ
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
