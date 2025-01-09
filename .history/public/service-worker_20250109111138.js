self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-resources').then((cache) => {
      return cache.addAll([
        '/public/bundle.client.js',
        '/public/manifest.json',
        '/public/index.html',
        '/public/path/to/your/animation.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果缓存中有响应，返回缓存的资源
      if (cachedResponse) {
        return cachedResponse;
      }
      // 否则通过网络请求资源
      return fetch(event.request);
    })
  );
});
