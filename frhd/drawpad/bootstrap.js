import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector('#view'));

document.documentElement.addEventListener('pointerdown', function(event) {
    this.style.setProperty('--offsetX', event.offsetX);
    this.style.setProperty('--offsetY', event.offsetY);
});