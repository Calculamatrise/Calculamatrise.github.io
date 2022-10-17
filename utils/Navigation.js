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
        fetch("/nav.html").then(r => r.text()).then(data => {
            this.ui.innerHTML = data;
        });

        document.body.prepend(document.nav = this.ui);
    }
}