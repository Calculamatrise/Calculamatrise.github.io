import App from "./utils/Application.js";

document.head.innerHTML += await fetch("/head.html").then(response => response.text());

window.Application = new App();

window.Application.init();

document.addEventListener("mousedown", function(event) {
    this.documentElement.style.setProperty("--offsetX", event.offsetX);
    this.documentElement.style.setProperty("--offsetY", event.offsetY);
});

document.addEventListener("scroll", function(event) {
    const rect = document.body.getBoundingClientRect();
    if (rect.y < 0) {
        Application.navigation.ui.style.setProperty("background-image", `linear-gradient(180deg, #${Application.getColorScheme() == "dark" ? "2d2d2d, rgba(45, 45, 45" : "d2d2d2, rgba(210, 210, 210"}, ${Math.min(.66 - (Application.navigation.ui.getBoundingClientRect().height - Math.abs(rect.y)) / 100, 1)}))`);
    }
});

window.addEventListener("popstate", function(event) {
    Application.router.navigate(location.pathname, {
        popped: true
    });
});

document.body.addEventListener("click", function(event) {
    if (event.target.tagName === "CHECKBOX") {
		event.target[(event.target.hasAttribute("checked") ? "remove" : "set") + "Attribute"]("checked", "");
	}
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}