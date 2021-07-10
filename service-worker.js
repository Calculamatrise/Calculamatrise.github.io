self.addEventListener("install", e => {
    e.waitUntil(caches.open("static").then(cache => {
        cache.addAll([
            "/index.html",
            "/header.html",
            "/footer.html",
            "/style.css",
            "/light.css",
            "/dark.css"
        ]);
    }));
    return self.skipWaiting();
});

self.addEventListener("activate", e => {
    self.clients.claim();
});

self.addEventListener("fetch", async e => {
    if (new URL(e.request.url).origin == location.origin) {
        e.respondWith(cacheFirst(e.request));
    } else {
        e.respondWith(networkAndCache(e.request));
    }
});

async function cacheFirst(req) {
    const cached = await caches.open("static").then(cache => cache.match(req))
    return cached || await fetch(req);
}

async function networkAndCache(req) {
    return caches.open("static").then(async cache => {
        return await fetch(req).then(async t => await cache.put(req, t.clone())).catch(e => cache.match(req));
    });
}