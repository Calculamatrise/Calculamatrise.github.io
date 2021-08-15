export default class {
    constructor() {
        this.id = null;
        this.redirectUri = `${location.origin}/auth/discord/redirect/`;
    }
    #secret_ = null;
    #token_ = null;
    #events_ = new Map();
    async ajax({ host, method = "GET", path, headers = { "content-type": "application/x-www-form-urlencoded" }, body }, callback = t => t) {
        return await new Promise(function(resolve, reject) {
            const res = new XMLHttpRequest();
            res.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(callback(JSON.parse(this.responseText)));
                }
            }
            res.open(method, `https://${host || "discord.com"}${path}`, true);
            for (const t in headers)
                res.setRequestHeader(t, headers[t]);
            res.send(new URLSearchParams(body));
        });
    }
    on(event, func = function() {}) {
        if (!event || typeof event !== "string")
            throw new Error("INVALID_EVENT");
        this.#events_.set(event, func.bind(this));
        return this;
    }
    emit(event, ...args) {
        if (!event || typeof event !== "string")
            throw new Error("INVALID_EVENT");
        event = this.#events_.get(event);
        if (!event && typeof event !== "function")
            throw new Error("INVALID_FUNCTION");
        return event(...args);
    }
    login({ id, secret, token }) {
        if (id) this.id = id;
        if (secret) this.#secret_ = secret;
        if (token) this.#token = token;
        console.log(this.#token)
        this.emit("ready");
        return this;
    }
    async requestToken(code) {
        return await this.ajax({
            path: "/api/oauth2/authorize",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: {
                client_id: this.id,
                client_secret: this.#secret_,
                grant_type: "authorization_code",
                code,
                redirect_uri: this.redirectUri,
                scope: "identify guilds guilds.join rpc"
            },
            method: "post"
        });
    }
    set #token(t) {
        let e = Array.from({ length: t.length }, () => Math.floor(Math.random() * 26));
        let i = "";
        for (const s in t)
            i += (t[s].charCodeAt(0) + e[s]) + `.${e[s].toString()}.`;
        this.#token_ = i;
    }
    get #token() {
        let t = this.#token_.split(/\.+/g);
        for (let e = 0; e in t; e += 2) {
            t[e] -= t[e + 1],
            delete t[e + 1];
        }
        return String.fromCharCode(...t.filter(t => t !== void 0));
    }
}