export default class {
    constructor() {
        this.init();
    }
    #styles = [];
    #scripts = [];
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
        if (!event || typeof event !== "string")
            return new Error("INVALID_EVENT");
        event = this.#events_.get(event);
        if (!event && typeof event !== "function")
            return new Error("INVALID_FUNCTION");
        return event(...args);
    }
    async init() {
        document.head.innerHTML = await fetch("/head.html").then(t => t.text());
        let nav = document.querySelector("nav");
        if (!nav) {
            fetch("/nav.html").then(t => t.text()).then(t => {
                document.body.prepend(this.createElement("nav", { innerHTML: t }));

                if (JSON.parse(localStorage.getItem("dark"))) {
                    dark.checked = true;
                }
            });
        }

        this.#emit("ready");
    }
    createElement(t, e = {}) {
        return Object.assign(document.createElement(t), e);
    }
    get innerHTML() {
        return fetch(location.pathname).then(t => t.text()).then(async t => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(t, "text/html");
            return doc.body.querySelector(".content").innerHTML;
        });
    }
    get scripts() {
        return this.#scripts;
    }
    set script(script) {
        this.#scripts.push(script);
        return this.#scripts;
    }
    get styles() {
        return this.#styles;
    }
    set style(style) {
        this.#styles.push(style);
        return this.#styles;
    }
    get pathname() {
        return location.pathname;
    }
}