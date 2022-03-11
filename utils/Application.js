import Navigation from "./Navigation.js";
import Router from "./Router.js";

export default class {
    navigation = new Navigation();
    router = new Router();
    get themedStylesheet() {
        return document.querySelector("link[rel='stylesheet']#theme");
    }

    init() {
        // this.router.init();
        this.navigation.init();
    }

    get settings() {
        this.settings = {};
        const settings = new Proxy(JSON.parse(localStorage.getItem("application-settings")), {
            get(target, key) {
                if (typeof target[key] === "object" && target[key] !== null) {
                    return new Proxy(target[key], this);
                }

                return target[key];
            },
            set(object, property, value) {
                object[property] = value;

                localStorage.setItem("application-settings", JSON.stringify(settings));
            
                return true;
            }
        });

        return settings;
    }

    set settings(value) {
        localStorage.setItem("application-settings", JSON.stringify(Object.assign({
            theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }, Object.assign(JSON.parse(localStorage.getItem("application-settings")) ?? {}, value ?? {}))));
    }
}