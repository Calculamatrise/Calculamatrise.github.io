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

    
}