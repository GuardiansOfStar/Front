// public/sw.js
const CACHE_NAME = 'image-cache-v1';
const CRITICAL_IMAGES = [
  '/assets/images/background.webp',
  '/assets/images/star_character.webp',
  '/assets/images/title.webp',
  '/assets/images/start_button.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CRITICAL_IMAGES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          });
        })
    );
  }
});