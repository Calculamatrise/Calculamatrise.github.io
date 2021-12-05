import App from "./utils/Application.js";

document.head.innerHTML += await fetch("/head.html").then(response => response.text());

window.Application = new App();

window.Application.init();

document.body.addEventListener("click", function(event) {
    const href = event.target.getAttribute("data-view");
    if (href) {
        Application.router.navigate(href);
        // location.assign(href);
    }
});

document.addEventListener("mousedown", function(event) {
    this.documentElement.style.setProperty("--offsetX", event.offsetX);
    this.documentElement.style.setProperty("--offsetY", event.offsetY);
});

window.addEventListener("popstate", function(event) {
    Application.router.navigate(location.pathname, {
        popped: true
    });
});

document.addEventListener("scroll", function(event) {
    const rect = document.body.getBoundingClientRect();
    const nav = document.querySelector("nav");
    
    if (rect.y < 0) {
        nav.style.setProperty("background-image", `linear-gradient(180deg, #${JSON.parse(localStorage.getItem("dark")) ? "2d2d2d, rgba(45, 45, 45" : "d2d2d2, rgba(210, 210, 210"}, ${Math.min(.66 - (nav.getBoundingClientRect().height - Math.abs(rect.y)) / 100, 1)}))`);
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}