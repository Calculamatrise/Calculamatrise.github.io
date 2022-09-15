const OFFLINE_CACHE = "offline";
const OFFLINE_PATHNAME = `/${OFFLINE_CACHE}/`;
const OFFLINE_RESOURCES = [
    OFFLINE_PATHNAME,
    "/utils/Application.js",
    "/utils/EventEmitter.js",
    "/utils/Navigation.js",
    "/utils/RecursiveProxy.js",
    "/utils/Router.js",
    "/404.html",
    "/bootstrap.js",
    "/nav.html",
    "/head.html",
    "/styles/default.css",
    "/styles/light.css",
    "/styles/dark.css",
    "/favicon.ico"
];

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(OFFLINE_CACHE).then(function(cache) {
        cache.addAll(OFFLINE_RESOURCES).then(function() {
            if (typeof self.skipWaiting == "function") {
                return self.skipWaiting();
            }
        });
    }));
});

self.addEventListener("activate", async function(event) {
    if (self.registration.navigationPreload) {
        event.waitUntil(self.registration.navigationPreload.enable());
    }

    event.waitUntil(caches.open(OFFLINE_CACHE));
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    const { pathname } = event.request.url ? new URL(event.request.url) : {};
    switch(event.request.method) {
        case "GET": {
            switch(pathname.split('/')[1]) {
                case 'offline': {
                    event.preventDefault();
                    return void event.respondWith(fetch("404.html"));
                }

                case 'private': {
                    event.preventDefault();
                    return void event.respondWith(new Response("403: Forbidden", {
                        status: 403,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }));
                }
            }

            fetch(event.request).catch(function(error) {
                return caches.open(OFFLINE_CACHE).then(function(cache) {
                    return cache.match(event.request) || cache.match(OFFLINE_PATHNAME);
                });
            });
            break;
        }

        case "POST": {
            event.preventDefault();
            event.respondWith(event.request.json().then(function(payload) {
                if (pathname === '/experiment/') {
                    if (event.request.headers.get("Authorization") != 2008) {
                        return void event.respondWith(new Response("Unauthorized", {
                            status: 401,
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        }));
                    }

                    return new Response("yum :: " + JSON.stringify(payload), {
                        status: 501,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
                }
            }));
            break;
        }
    }
});