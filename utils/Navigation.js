export default class {
    ui = null;
    get active() {
        return this.ui && !!this.ui.parentElement;
    }

    init() {
        if (!this.active) {
            this.create();
        }
    }

    async create() {
        this.ui = document.querySelector("nav") || document.createElement("nav");
        this.ui.innerHTML = await fetch("/nav.html").then(response => response.text());

        document.body.prepend(this.ui);

        if (JSON.parse(localStorage.getItem("dark")) === null) {
            Application.settings.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
    }
}