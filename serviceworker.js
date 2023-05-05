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
  async function fetchAssets(event) {
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
  event.respondWith(fetchAssets(event));
});
