const VERSION = "v1";

const CACHE_NAME = `pwa/1.sound-app-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/pwa_1.sound-app/",
  "/pwa_1.sound-app/index.html",
  "/pwa_1.sound-app/dist/bundle.js",
  "/pwa_1.sound-app/style.css",
  "/pwa_1.sound-app/images/sound-app-icon.png",
  "/pwa_1.sound-app/sound-app.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      console.log("event: install")
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      console.log("event: activate")
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (e) => {
    if (!(
       e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
