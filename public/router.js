export default class {
    constructor() {
        document.head.innerHTML = fetch("/head.html").then(t => t.text()).then(t => {
            let nav = document.querySelector("nav");
            if (!nav) {
                fetch("/nav.html").then(t => t.text()).then(t => {
                    document.body.prepend(this.#createElement("nav", { innerHTML: t }));

                    if (!localStorage.getItem("dark")) {
                        localStorage.setItem("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
                    }

                    if (JSON.parse(localStorage.getItem("dark"))) {
                        dark.checked = true;
                    }
                });
            }
        });

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker.js");
        }
    }
    #styles = [];
    #scripts = [];
    #events = new Map();
    get innerHTML() {
        return fetch(location.pathname).then(t => t.text()).then(async t => {
            let parser = new DOMParser();

            return parser.parseFromString(t, "text/html");
        });
    }
    get scripts() {
        return this.#scripts;
    }
    set scripts(scripts) {
        return this.#scripts = scripts;
    }
    set script(script) {
        this.#scripts.push(script);

        return this.#scripts;
    }
    get styles() {
        return this.#styles;
    }
    set styles(styles) {
        return this.#styles = styles;
    }
    set style(style) {
        this.#styles.push(style);
        
        return this.#styles;
    }
    get pathname() {
        return location.pathname;
    }
    on(event, func = function() {}) {
        if (!event || typeof event !== "string")
            throw new Error("INVALID_EVENT");

        this.#events.set(event, func.bind(this));

        return this;
    }
    get(pathname, func = function() {}) {
        if (!pathname || typeof pathname !== "string")
            return new Error("INVALID_EVENT");

        this.#events.set(pathname, func.bind(this));

        return this;
    }
    #emit(event, ...args) {
        let global;
        if (!event || typeof event !== "string")
            return new Error("INVALID_EVENT");

        if (event.includes("/*"))
            global = true;
            
        event = this.#events.get(event);
        if (!event && !global)
            event = this.#events.get("/*");
            
        if (!event && typeof event !== "function")
            return new Error("INVALID_FUNCTION");

        return event(...args);
    }
    #createElement(t, e = {}) {
        return Object.assign(document.createElement(t), e);
    }
    async init() {
        try {
            this.#emit(this.pathname);
            let dir = this.pathname.slice(1, -1).split("/");
            if (dir.length > 1) {
                for (let t = 1; t < dir.length; t++) {
                    let pathname = dir.slice(0, -t).join("/");
                    this.#emit(`/${pathname}/*`);
                }
            }

            this.replaceContent(await this.innerHTML);
        } catch(e) {
            console.error(e);
            this.#emit("/*");
        }
    }
    navigate(pathname) {
        if (!pathname || pathname === void 0)
            return;

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

            this.style = style;
        }
    }
    addScripts(...scripts) {
        if (Array.isArray(scripts[0]))
            scripts = scripts[0];

        for (let t of scripts) {
            if (typeof t !== "object") {
                t = {
                    type: "text/javascript",
                    src: t
                }
            }

            console.log(t.src)
            fetch(t.src);
            let script = document.querySelector(`script[src='${t.src}']`);
            if (!script) {
                script = this.#createElement("script", t);

                document.head.appendChild(script);
            }

            if (t.type === "module") return;

            this.script = script;
        }
    }
    removeTempContent() {
        for (const style of this.styles)
            style.remove();

        for (const script of this.scripts)
            script.remove();

        this.styles = [];
        this.scripts = [];
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