import Router from "./router.js";

const router = new Router();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}

router.get("/", function() {
    this.setTitle("Headquarters - Calculamatrise");
    this.setIcon("/favicon.ico");
});

router.get("/login/", function() {
    this.setTitle("Login - Calculamatrise");
    this.setIcon("/favicon.ico");
});

router.get("/rae/", function() {
    this.setTitle("Rae - Calculamatrise");
    this.setIcon("/rae/favicon.ico");
    this.addStyles("/rae/style.css");
    this.addScripts("/rae/script.js");
});

router.get("/frhd/api/docs/", function() {
    this.setTitle("Documentation - FRHD API");
    this.setIcon("/favicon.ico");
});

router.get("/frhd/tools/", function() {
    this.setTitle("Tools - FRHD");
    this.setIcon("/frhd/favicon.ico");
});

router.get("/frhd/tools/api/", function() {
    this.setTitle("Visual Editor - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts({
        src: "bootstrap.js",
        type: "module"
    });
});

router.get("/frhd/tools/combine/", function() {
    this.setTitle("Combine - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts("script.js");
});

router.get("/frhd/tools/editor/", function() {
    this.setTitle("Advanced Editor - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts({
        src: "bootstrap.js",
        type: "module"
    });
});

router.get("/frhd/tools/image_generator/", function() {
    this.setTitle("Image Generator - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts("bootstrap.js");
});

router.get("/frhd/tools/move/", function() {
    this.setTitle("Move - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts({
        src: "bootstrap.js",
        type: "module"
    });
});

router.get("/frhd/tools/render/", function() {
    this.setTitle("Render - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts("script.js");
});

router.get("/frhd/tools/reverse/", function() {
    this.setTitle("Reverse - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts("script.js");
});

router.get("/frhd/tools/tube_generator/", function() {
    this.setTitle("Tube Generator - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts({
        src: "bootstrap.js",
        type: "module"
    });
});

router.get("/frhd/tools/video_generator/", function() {
    this.setTitle("Video Generator - Tools");
    this.setIcon("/favicon.ico");
    this.addScripts("bootstrap.js");
});

router.get("/games/bhr/", function() {
    this.setTitle("Black Hat Rider Experiment");
    this.setIcon("/favicon.ico");
    this.addScripts({
        innerHTML: `
            import BHR from "/games/bhr/bootstrap.js";

            BHR.ride();
        `,
        type: "module"
    });
});

router.get("/games/clicker/", function() {
    this.setTitle("Clicker");
    this.setIcon("/favicon.ico");
    this.addScripts({
        src: "/games/clicker/script.js",
        type: "module"
    });
});

router.get("/auth/discord/redirect/", function() {
    this.setTitle("Redirecting - Calculamatrise");
    this.setIcon("/favicon.ico");
    this.addScripts("/auth/discord/redirect/bootstrap.js");
});

router.get("/contact/", function() {
    this.setTitle("Contact - Calculamatrise");
    this.setIcon("/favicon.ico");
});

router.get("/*", function() {
    this.setTitle("Page not found");
    this.setIcon("/favicon-disabled.ico");
});

document.addEventListener("DOMContentLoaded", function() {
    this.body.addEventListener("click", function(e) {
        const href = e.target.getAttribute("data-view");
        if (href) {
            router.navigate(href);
        }
    });
});

window.addEventListener("popstate", router.init.bind(router));