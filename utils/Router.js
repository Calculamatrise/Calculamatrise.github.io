import EventEmitter from "./EventEmitter.js";

export default class extends EventEmitter {
    get pathname() {
        return location.pathname;
    }

    async init() {
        // this may be useful later.
    }

    /**
     * 
     * @param {String} pathname 
     * @param {Object[Boolean]} options[popped] 
     * @returns {Promise}
     */
    async navigate(pathname, { popped = false } = {}) {
        if (pathname === void 0 || typeof pathname !== "string") {
            return;
        }

        history[(popped ? "replace" : "push") + "State"](null, document.title, pathname);

        try {
            this.emit(this.pathname);
            let dir = this.pathname.slice(1, -1).split("/");
            if (dir.length > 1) {
                for (let t = 1; t < dir.length; t++) {
                    let pathname = dir.slice(0, -t).join("/");
                    this.emit(`/${pathname}/*`);
                }
            }

            location.assign(this.pathname);
            // this.replaceContent(await fetch(this.pathname).then(response => response.text()));
        } catch(e) {
            console.error(e);
            this.emit("/*");
        }
    }

    replaceContent(data) {
        let parser = new DOMParser();
        data = parser.parseFromString(data, "text/html");

        for (const element of data.body.querySelectorAll("link")) {
            const link = document.createElement("link");
            link.rel = element.rel || "";
            link.href = element.href;

            document.body.appendChild(link);
        }

        for (const element of data.scripts) {
            const script = document.createElement("script");
            script.type = element.type || "";
            script.src = element.src;

            document.body.appendChild(script);
        }

        document.body = data.body;
        document.title = data.title;
    }
}