const CACHE_NAME = "echoplay-cache-v2";

// Statische bestanden om te cachen
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",  // Plaats logo in public/
  "/icons/icon.png",
];

// Installatie van de Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        urlsToCache.map((url) => cache.add(url).catch(() => {}))
      )
    )
  );
  self.skipWaiting();
});

// Activatie: oude caches verwijderen
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => name !== CACHE_NAME && caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: fallback voor navigatie + cache voor assets
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // SPA fallback
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }
  

  // Andere assets: eerst cache, dan netwerk, fallback voor images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.destination === "image") {
          return caches.match("/logo.png");
        }
      });
    })
  );
});
