const CACHE_NAME = "echoplay-cache-v2";

// Cache de belangrijkste statische bestanden
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/logo.png", 
  "/assets/cover.jpg", 
];

// Installatie van de Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // probeer alle bestanden te cachen, maar negeer fouten
      Promise.allSettled(urlsToCache.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

// Activatie: oude caches verwijderen
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => name !== CACHE_NAME && caches.delete(name)))
    )
  );
  self.clients.claim();
});

// Fetch event: probeer eerst uit cache, anders netwerk
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // fallback voor navigatie naar index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

