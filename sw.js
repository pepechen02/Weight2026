const CACHE_NAME = "weight2026-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 安裝時，先把核心檔案存進快取
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 啟用時，清掉舊版本快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 網路優先，抓不到才用快取（避免體重資料被快取卡住）
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
