// service-worker.js

const CACHE_NAME = 'redemption-cache-v1';  // 缓存的版本
const REDemption_STORE = 'redemption-store';  // 数据库名称
const CACHE_URLS = ['/'];  // 需要缓存的资源

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 获取数据，首先从缓存获取，如果缓存中没有再请求网络
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// 保存兑换记录到 IndexedDB
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SAVE_REDEMPTION') {
    saveRedemptionToIndexedDB(event.data.payload);
  }
});

// 使用 IndexedDB 存储兑换记录
function saveRedemptionToIndexedDB(payload) {
  const request = indexedDB.open(REDemption_STORE, 1);

  request.onupgradeneeded = function (e) {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('redemptions')) {
      const store = db.createObjectStore('redemptions', { keyPath: 'id', autoIncrement: true });
      store.createIndex('date', 'date', { unique: false });
    }
  };

  request.onsuccess = function (e) {
    const db = e.target.result;
    const transaction = db.transaction('redemptions', 'readwrite');
    const store = transaction.objectStore('redemptions');

    store.add(payload);
    transaction.oncomplete = function () {
      console.log('Redemption data saved to IndexedDB');
    };
    transaction.onerror = function (error) {
      console.error('Error saving redemption data:', error);
    };
  };

  request.onerror = function (error) {
    console.error('Error opening IndexedDB:', error);
  };
}
