import Navigation from "./Navigation.js";
import Router from "./Router.js";

export default class {
    navigation = new Navigation();
    router = new Router();
    get storage() {
        let storage; this.storage = {};
        return storage = new Proxy(JSON.parse(localStorage.getItem("application-settings")), {
            get(target, key) {
                if (typeof target[key] === "object" && target[key] !== null) {
                    return new Proxy(target[key], this);
                }

                return target[key];
            },
            set(object, property, value) {
                object[property] = value;

                localStorage.setItem("application-settings", JSON.stringify(storage));
                return true;
            }
        });
    }

    set storage(value) {
        localStorage.setItem("application-settings", JSON.stringify(Object.assign({
            theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }, Object.assign(JSON.parse(localStorage.getItem("application-settings")) ?? {}, value ?? {}))));
    }

    get themedStylesheet() {
        let element = document.querySelector("link[rel='stylesheet']#theme");
        if (element === null) {
            element = document.head.appendChild(document.createElement("link"));
            element.id = "theme";
            element.rel = "stylesheet";
            element.href = "/styles/" + Application.storage.theme + ".css";
        }

        return element;
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
}