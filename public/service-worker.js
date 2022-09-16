const CACHE_VERSION = 1;
const OFFLINE_CACHE = "offline_cache_" + CACHE_VERSION;
const OFFLINE_PATHNAME = "/offline/";
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

self.addEventListener("activate", function(event) {
    if (self.registration.navigationPreload) {
        event.waitUntil(self.registration.navigationPreload.enable());
    }

    event.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key != OFFLINE_CACHE) {
                return caches.delete(key);
            }
        }));
    }));
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    event.preventDefault();

    const { pathname, searchParams } = event.request.url ? new URL(event.request.url) : {};
    const list = pathname.split('/');
    switch(event.request.method) {
        case "GET": {
            console.log(event.request);
            switch(list[1]) {
                case 'frhd': {
                    let list = pathname.split('/');
                    if (list[2] === 'tools' && (list[3] === 'image-converter' || list[3] === 'video-converter') && !searchParams.has("bypass")) {
                        return void event.respondWith(Response.resolveStatus(401, "Unauthorized"));
                    }
                    break;
                }

                case 'offline': {
                    return void event.respondWith(fetch("404.html"));
                }

                case 'private': {
                    return void event.respondWith(new Response("403 Forbidden", {
                        status: 403,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }));
                }
            }

            return void event.respondWith(fetch(event.request).catch(function(error) {
                return caches.open(OFFLINE_CACHE).then(function(cache) {
                    return cache.match(event.request) || cache.match(OFFLINE_PATHNAME);
                });
            }));
        }

        case "POST": {
            const endpoint = pathname.replace(/\/?$/, '/');
            if (event.request.headers.get("Authorization") != 2008) {
                event.respondWith(new Response("401 Unauthorized", {
                    status: 401,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }));
            } else {
                // endpoints w/ out payload
                switch(endpoint) {
                    case '/api/users/get/': {
                        return event.respondWith(new Response("Example response w/ no payload", {
                            status: 501,
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        }));
                    }
                }

                event.respondWith(event.request.json().then(function(payload) {
                    if (pathname === '/api/experiment/') {
                        return new Response("yum :: " + JSON.stringify(payload), {
                            status: 501,
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        });
                    }
                }));
            }
            break;
        }
    }
});

Response.resolveStatus = function(status = 404, message = "Page Not Found") {
    const code = Math.max(100, ~~status);
    return new Response(JSON.stringify({
        message: `${code}: ${message}`,
        code: 0
    }, null, 4), {
        status: code,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}