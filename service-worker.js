const OFFLINE_CACHE = "offline";
const OFFLINE_PATHNAME = "/offline/";
const OFFLINE_RESOURCES = [
    OFFLINE_PATHNAME,
    "/utils/Application.js",
    "/utils/EventEmitter.js",
    "/utils/Navigation.js",
    "/utils/Router.js",
    "/bootstrap.js",
    "/nav.html",
    "/head.html",
    "/styles/style.css",
    "/styles/light.css",
    "/styles/dark.css",
    "/favicon.ico"
];

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(OFFLINE_CACHE).then(function(cache) {
        cache.addAll(OFFLINE_RESOURCES);
    }).then(function() {
        if (typeof self.skipWaiting === "function") {
            return self.skipWaiting();
        }
        
        return;
    }));
});

self.addEventListener("activate", function(event) {
    event.waitUntil(caches.open(OFFLINE_CACHE))
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    switch(event.request.method.toLowerCase()) {
        case "get":
            fetch(event.request).catch(function(error) {
                return caches.open(OFFLINE_CACHE).then(function(cache) {
                    return cache.match(event.request) || cache.match(OFFLINE_PATHNAME);
                });
            });
        break;

        case "post":
            // let headers = event.request.headers;
            // event.request.json().then(console.log)
            // event.respondWith(new Response(JSON.stringify({
            //     yups: "yum"
            // }), {
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // }));
        break;
    }
});