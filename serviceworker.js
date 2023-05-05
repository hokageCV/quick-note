const assets = ["./", "./style.css", "./app.js", "./sw-registerer.js"];
// "/" is the html file; these are urls, not file names

// cache the assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("assets").then((cache) => {
      cache.addAll(assets);
    })
  );
});

// fetch the assets
self.addEventListener("fetch", (event) => {
  event.respondWith(fetchAssetsStaleWhileRevalidate(event));
});

// ======================================================
async function fetchAssetsStaleWhileRevalidate(event) {
  const assetsCache = await caches.open("assets");
  const cachedResponse = await assetsCache.match(event.request);

  // even if cache is present, fetch from network
  const networkResponse = await fetch(event.request);
  const responseToCache = networkResponse.clone();

  await assetsCache.put(event.request, responseToCache);

  return cachedResponse || networkResponse;
}

async function fetchAssetsCacheFirst(event) {
  const assetsCache = await caches.open("assets");
  const cachedResponse = await assetsCache.match(event.request);

  // cache hit - return response
  if (cachedResponse) {
    return cachedResponse;
  }
  // cache miss - fetch from network
  else {
    const response = await fetch(event.request);
    assetsCache.put(event.request, response.clone());
    return response;
  }
}
// ======================================================
