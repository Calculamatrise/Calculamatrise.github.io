import App from "./utils/Application.js";

document.head.innerHTML += await fetch('/head.html').then(r => r.text());
window.Application = new App({
    theme: 'auto'
});

document.documentElement.addEventListener('pointerdown', function(event) {
    this.style.setProperty('--offsetX', event.offsetX);
    this.style.setProperty('--offsetY', event.offsetY);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}