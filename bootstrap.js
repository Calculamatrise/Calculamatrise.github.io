import Router from "./router.js";

fetch("/head.html").then(async t => document.head.innerHTML += await t.text());
fetch("/nav.html").then(t => t.text()).then(t => {
    document.body.prepend(Object.assign(document.createElement("nav"), { innerHTML: t }));

    if (!localStorage.getItem("dark")) {
        localStorage.setItem("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    if (JSON.parse(localStorage.getItem("dark"))) {
        dark.checked = true;
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}

// const router = new Router();

// router.get("/", function() {
//     this.setTitle("Headquarters - Calculamatrise");
// });

// router.get("/login/", function() {
//     this.setTitle("Login - Calculamatrise");
// });

// router.get("/rae/", function() {
//     this.setTitle("Rae - Calculamatrise");
//     this.setIcon("/rae/favicon.ico");
//     this.addStyles("/rae/style.css");
//     this.addScripts("/rae/script.js");
// });

// router.get("/image2svg/", function() {
//     this.setTitle("Image to SVG - Calculamatrise");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/api/docs/", function() {
//     this.setTitle("Documentation - FRHD API");
// });

// router.get("/frhd/tools/", function() {
//     this.setTitle("Tools - FRHD");
// });

// router.get("/frhd/tools/api/", function() {
//     this.setTitle("Visual Editor - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/tools/combine/", function() {
//     this.setTitle("Combine - Tools");
//     this.addScripts("script.js");
// });

// router.get("/frhd/tools/editor/", function() {
//     this.setTitle("Advanced Editor - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/tools/image_generator/", function() {
//     this.setTitle("Image Generator - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/tools/move/", function() {
//     this.setTitle("Move - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/tools/render/", function() {
//     this.setTitle("Render - Tools");
//     this.addScripts("script.js");
// });

// router.get("/frhd/tools/reverse/", function() {
//     this.setTitle("Reverse - Tools");
//     this.addScripts("script.js");
// });

// router.get("/frhd/tools/tube_generator/", function() {
//     this.setTitle("Tube Generator - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/frhd/tools/video_generator/", function() {
//     this.setTitle("Video Generator - Tools");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/games/bhr/", function() {
//     this.setTitle("Black Hat Rider Experiment");
//     this.addScripts({
//         innerHTML: `
//             import BHR from "/games/bhr/bootstrap.js";

//             BHR.ride();
//         `,
//         type: "module"
//     });
// });

// router.get("/games/clicker/", function() {
//     this.setTitle("Clicker");
//     this.addScripts({
//         src: "/games/clicker/script.js",
//         type: "module"
//     });
// });

// router.get("/games/snake/", function() {
//     this.setTitle("Clicker");
// });

// router.get("/auth/discord/redirect/", function() {
//     this.setTitle("Redirecting - Calculamatrise");
//     this.addScripts({
//         src: "bootstrap.js",
//         type: "module"
//     });
// });

// router.get("/contact/", function() {
//     this.setTitle("Contact - Calculamatrise");
// });

// router.get("/offline/", function() {
//     this.setTitle("Offline - Calculamatrise");
//     this.setIcon("/favicon-disabled.ico");
// });

// router.get("/*", function() {
//     this.setTitle("Page not found - Calculamatrise");
//     this.setIcon("/favicon-disabled.ico");
// });

document.addEventListener("DOMContentLoaded", function() {
    this.body.addEventListener("click", function(event) {
        const href = event.target.getAttribute("data-view");
        if (href) {
            // router.navigate(href);
            location.assign(href);
        }
    });
});

document.addEventListener("mousedown", function(event) {
    this.documentElement.style.setProperty("--offsetX", event.offsetX);
    this.documentElement.style.setProperty("--offsetY", event.offsetY);
});

let pathname = location.pathname;

window.addEventListener("hashchange", function(state) {
    pathname = location.pathname;
});

// window.addEventListener("popstate", function(state) {
//     if (location.pathname !== pathname)
//         router.navigate(location.pathname);
// });



document.addEventListener("scroll", function(event) {
    const rect = document.body.getBoundingClientRect();
    const nav = document.querySelector("nav");
    if (rect.y < 0) {
        nav.style.setProperty("background-image", `linear-gradient(180deg, #${JSON.parse(localStorage.getItem("dark")) ? "2d2d2d, rgba(45, 45, 45" : "d2d2d2, rgba(210, 210, 210"}, ${Math.min(.66 - (nav.getBoundingClientRect().height - Math.abs(rect.y)) / 100, 1)}))`);
    }
});