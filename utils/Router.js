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

            this.replaceContent(await fetch(this.pathname).then(response => response.text()));
        } catch(e) {
            console.error(e);
            this.emit("/*");
        }
    }

    replaceContent(data) {
        let parser = new DOMParser();
        data = parser.parseFromString(data, "text/html");

        let content = document.querySelector(".content") || document.createElement("div");
        content.className = "content";
        content.innerHTML = data.querySelector(".content").innerHTML;

        /**
         * @todo figure out how to add/remove scripts/previously used resources from the page
         */
        for (const script of [
            ...document.body.querySelectorAll("link"),
            ...document.body.querySelectorAll("script")
        ]) {
            script.remove();
        }

        for (const element of [
            ...data.body.querySelectorAll("link")
        ]) {
            const link = document.createElement("link");
            link.rel = element.rel || "";
            link.href = element.href;
        
            document.body.appendChild(link);
        }

        for (const element of [
            ...data.body.querySelectorAll("script")
        ]) {
            const script = document.createElement("script");
            script.type = element.type || "";
            script.src = element.src;
        
            document.body.appendChild(script);
        }

        document.title = data.title;
    }
}