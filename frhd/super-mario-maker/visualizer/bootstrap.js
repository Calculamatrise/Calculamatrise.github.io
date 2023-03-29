import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector('#view'));

if (window.canvas.settings.theme == 'dark') {
	document.documentElement.attributeStyleMap.clear();
} else {
	document.documentElement.style.setProperty('--accent-color', '#D2D2D2');
	document.documentElement.style.setProperty('--background', '#EBEBEB');
	document.documentElement.style.setProperty('--text', '#1B1B1B');
}

document.documentElement.addEventListener('pointerdown', function(event) {
    this.style.setProperty('--offsetX', event.offsetX);
    this.style.setProperty('--offsetY', event.offsetY);
});