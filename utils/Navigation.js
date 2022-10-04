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
        fetch("/nav.html").then(async response => {
            this.ui.innerHTML = await response.text();
        });

        document.head.after(document.nav = this.ui);
    }
}