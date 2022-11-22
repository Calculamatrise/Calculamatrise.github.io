import EventEmitter from "./EventEmitter.js";
import Interface from "./Interface.js";
import RecursiveProxy from "./RecursiveProxy.js";
import Router from "./Router.js";

export default class extends EventEmitter {
    get themedStylesheet() {
        let element = document.querySelector("link[rel='stylesheet']#theme");
        if (element === null) {
            element = document.head.appendChild(document.createElement('link'));
            element.id = 'theme';
            element.rel = 'stylesheet';
            element.href = `/styles/${this.getColorScheme()}.css`;
        }

        return element;
    }

    interface = new Interface(this);
    router = new Router();
    storage = new RecursiveProxy(Object.assign({}, JSON.parse(localStorage.getItem('application-settings'))), {
        set() {
            Reflect.set(...arguments);
            localStorage.setItem('application-settings', JSON.stringify(this));
            return true;
        },
        deleteProperty() {
            Reflect.deleteProperty(...arguments);
            localStorage.setItem('application-settings', JSON.stringify(this));
            return true;
        }
    });

    constructor(defaults = {}) {
        super();
        Object.assign(this.storage, defaults);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.setColorScheme.bind(this));
        window.addEventListener('load', () => void this.setColorScheme());
    }

    getColorScheme() {
        if (typeof this.storage.theme == 'string' && this.storage.theme != 'auto') {
            return this.storage.theme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setColorScheme(colorScheme = window.matchMedia('(prefers-color-scheme: dark)')) {
        if (typeof colorScheme != 'object') {
            colorScheme = {
                matches: 'dark' === this.getColorScheme()
            };
        }

        this.themedStylesheet.href = `/styles/${colorScheme.matches ? 'dark' : 'light'}.css`;
    }
}