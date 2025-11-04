const CACHE_NAME = "echoplay-cache-v2";

// Statische bestanden om te cachen
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/logo.png",
  "/assets/cover.jpg",
  "icons/icon.png",
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
      Promise.all(names.map((name) => name !== CACHE_NAME && caches.delete(name)))
    )
  );
  self.clients.claim();
});

// Fetch event: fallback voor navigatie + cache voor assets
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Alle navigatievragen (zoals /home, /about) terug naar index.html
    event.respondWith(
      caches.match("/index.html").then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => caches.match("/index.html"));
      })
    );
    return;
  }

  // Andere assets: eerst cache, dan netwerk
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
