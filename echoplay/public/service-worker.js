const CACHE_NAME = "echoplay-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Install event: cache belangrijke bestanden
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activeer nieuwe SW direct
});

// Activate event: oude caches opruimen
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim(); // neem direct controle over pagina's
});

// Fetch event: serve cached files of fallback naar index.html (SPA)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // alleen GET requests

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      // Probeer netwerk, fallback naar index.html bij failure
      return fetch(event.request).catch(() => caches.match("/index.html"));
    })
  );
});
