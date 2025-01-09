self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open('static-resources').then((cache) => {
      return cache.addAll([
        '/public/bundle.client.js',
        '/public/index.html',
        '/public/manifest.json',
        '/public/path/to/your/animation.json', // 例如 Lottie 动画资源
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果缓存中存在响应，返回缓存
      if (cachedResponse) {
        return cachedResponse;
      }
      // 否则继续从网络请求
      return fetch(event.request);
    })
  );
});
