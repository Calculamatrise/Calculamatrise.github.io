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

    const { pathname } = event.request.url ? new URL(event.request.url) : {};
    switch(event.request.method) {
        case "GET": {
            switch(pathname.split('/')[1]) {
                case 'offline': {
                    return void event.respondWith(fetch("404.html"));
                }

                case 'private': {
                    return void event.respondWith(new Response("403: Forbidden", {
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
            // if (event.request.headers.get("Authorization") != 2008) {
            //     event.respondWith(new Response("Unauthorized", {
            //         status: 401,
            //         headers: {
            //             'Content-Type': 'text/plain'
            //         }
            //     }));
            // } else {
                switch(endpoint) {
                    case '/api/users/get/': {
                        return event.respondWith(new Response("Example response w/ no payload", {
                            status: 501,
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        }));
                        break;
                    }

                    default: {
                        return event.respondWith(event.request.json().then(function(payload) {
                            return fetch(pathname.replace(/((\.\w*)|\/)?$/, '.js')).then(function(data) {
                                return data.text().then(function(script) {
                                    return eval(`(async function() {
                                        const payload = ${JSON.stringify(payload)};
                                        const request = new Request(${JSON.stringify(event.request)});
                                        const writeHead = (statusCode, headers) => {
                                            if (typeof statusCode == 'object') {
                                                if ('status' in this) {
                                                    this.status = statusCode.status;
                                                }
    
                                                if ('headers' in this) {
                                                    this.headers = new Headers(statusCode.headers);
                                                }
                                            } else {
                                                this.status = Math.max(200, ~~statusCode);
                                                if (typeof headers == 'object' && headers !== null) {
                                                    this.headers = new Headers(headers);
                                                }
                                            }
                                        }
                                        const write = (data, head) => {
                                            this.data += data;
                                            if (typeof head == 'object' && head !== null) {
                                                writeHead(head);
                                            }
                                        }
                                        this.data += await (async () => {
                                            ${script}
                                        })();
                                        if (this.data.length > 0) {
                                            this.status = 200;
                                        }
                                        this.data = this.data ?? '404 Endpoint does not exist!';
                                        return this;
                                    }).call({
                                        data: '',
                                        status: 404,
                                        headers: new Headers()
                                    })`).then(function(res) {
                                        if (!res.headers.has("Content-Type")) {
                                            res.headers.set("Content-Type", "text/plain");
                                        }
                                        console.log(res)
        
                                        return new Response(res.data, {
                                            status: res.status,
                                            headers: res.headers
                                        });
                                    });
                                });
                            });
                        }));
                        break;
                    }
                }

                // event.respondWith(event.request.json().then(function(payload) {
                //     if (pathname === '/api/experiment/') {
                //         return new Response("yum :: " + JSON.stringify(payload), {
                //             status: 501,
                //             headers: {
                //                 'Content-Type': 'text/plain'
                //             }
                //         });
                //     }
                // }));
            //}
            break;
        }
    }
});

