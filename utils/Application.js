import EventEmitter from "./EventEmitter.js";
import Navigation from "./Navigation.js";
import RecursiveProxy from "./RecursiveProxy.js";
import Router from "./Router.js";

export default class extends EventEmitter {
    navigation = new Navigation();
    router = new Router();
    get storage() {
        this.storage = {};
        return new RecursiveProxy(JSON.parse(localStorage.getItem("application-settings")), {
            set(object, property, value) {
                object[property] = value;
                return localStorage.setItem("application-settings", JSON.stringify(this)),
                true;
            }
        });
    }

    set storage(value) {
        localStorage.setItem("application-settings", JSON.stringify(Object.assign({
            theme: "auto"
        }, Object.assign(JSON.parse(localStorage.getItem("application-settings")) ?? {}, value ?? {}))));
    }

    get themedStylesheet() {
        let element = document.querySelector("link[rel='stylesheet']#theme");
        if (element === null) {
            element = document.head.appendChild(document.createElement("link"));
            element.id = "theme";
            element.rel = "stylesheet";
            element.href = `/styles/${this.getColorSceme()}.css`;
        }

        return element;
    }

    constructor() {
        super();

        window.addEventListener("load",  () => void this.setColorScheme());
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.setColorScheme.bind(this));
    }

    init() {
        this.router.init();
        this.navigation.init();
        this.navigation.ui.addEventListener("click", (event) => {
            let href = event.target.getAttribute("data-view");
            if (href) {
                this.router.navigate(href);
                // location.assign(href);
            }
        });
    }

    getColorSceme() {
        if (typeof Application.storage.theme == 'string' && Application.storage.theme != 'auto') {
            return Application.storage.theme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setColorScheme(colorScheme = window.matchMedia('(prefers-color-scheme: dark)')) {
        if (typeof colorScheme != 'object') {
            colorScheme = {
                matches: 'dark' === this.getColorSceme()
            };
        }

        this.themedStylesheet.href = `/styles/${colorScheme.matches ? 'dark' : 'light'}.css`;
    }
}