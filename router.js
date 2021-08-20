import View from "./view.js";

export default class {
    constructor(...routes) {
        this.routes = Array.isArray(arguments[0]) ? arguments[0] : routes;

        this.view = new View();
        this.view.on("ready", this.init.bind(this));
    }
    #events_ = new Map();
    on(event, func = function() {}) {
        if (!event || typeof event !== "string")
            throw new Error("INVALID_EVENT");
        this.#events_.set(event, func.bind(this));
        return this;
    }
    get(pathname, func = function() {}) {
        if (!pathname || typeof pathname !== "string")
            return new Error("INVALID_EVENT");
        this.#events_.set(pathname, func.bind(this));
        return this;
    }
    #emit(event, ...args) {
        let global;
        if (!event || typeof event !== "string")
            return new Error("INVALID_EVENT");
        if (event.includes("/*"))
            global = true;
        event = this.#events_.get(event);
        if (!event && !global)
            event = this.#events_.get("/*");
        if (!event && typeof event !== "function")
            return new Error("INVALID_FUNCTION");
        return event(...args);
    }
    #createElement(t, e = {}) {
        return Object.assign(document.createElement(t), e);
    }
    async init() {
        try {
            this.removeTempContent();

            this.#emit(this.view.pathname);
            let dir = this.view.pathname.slice(1, -1).split("/");
            if (dir.length > 1) {
                for (let t = 1; t < dir.length; t++) {
                    let pathname = dir.slice(0, -t).join("/");
                    this.#emit(`/${pathname}/*`);
                }
            }

            this.replaceContent(await this.view.innerHTML);
        } catch(e) {
            console.error(e);
            this.#emit("/*");
        }
    }
    navigate(pathname) {
        if (!pathname || pathname === void 0) return;
        history.pushState(null, null, pathname);
        this.init();
    }
    setTitle(t) {
        document.title = t;
    }
    setIcon(t) {
        let icon = document.querySelector("link[rel=icon]");
        if (!icon) {
            icon = this.#createElement("link", { rel: "icon" });
            
            document.head.appendChild(icon);
        }

        icon.href = t
    }
    addStyles(...styles) {
        if (Array.isArray(styles[0])) styles = styles[0];
        for (let t of styles) {
            if (typeof t !== "object") {
                t = {
                    rel: "stylesheet",
                    href: t
                }
            }
            let style = document.querySelector(`link[href='${t.src}']`);
            if (!style) {
                style = this.#createElement("link", t);

                document.head.appendChild(style);
            }

            this.view.style = style;
        }
    }
    addScripts(...scripts) {
        if (Array.isArray(scripts[0])) scripts = scripts[0];
        for (let t of scripts) {
            if (typeof t !== "object") {
                t = {
                    type: "text/javascript",
                    src: t
                }
            }

            let script = document.querySelector(`script[src='${t.src}']`);
            if (!script) {
                script = this.#createElement("script", t);

                document.head.appendChild(script);
            }

            if (t.type === "module") return;

            this.view.script = script;
        }
    }
    removeTempContent() {
        for (const style of this.view.styles)
            style.parentElement.removeChild(style),
            style.remove();

        for (const script of this.view.scripts)
            script.parentElement.removeChild(script),
            script.remove();

        this.view.styles = [];
        this.view.scripts = [];
    }
    replaceContent(t) {
        let content = document.querySelector(".content");
        if (!content) {
            content = document.createElement("div");

            content.className = "content";
        }

        content.innerHTML = t;
    }
}