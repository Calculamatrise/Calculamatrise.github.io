import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector('#view'));
container.addEventListener('contextmenu', function(event) {
	event.preventDefault();
});

if (window.canvas.settings.theme == 'dark') {
	document.documentElement.style.setProperty('--accent-color', '#2D2D2D');
	document.documentElement.style.setProperty('--background', '#1B1B1B');
	document.documentElement.style.setProperty('--hard-background', '#111111');
	document.documentElement.style.setProperty('--soft-background', '#333333');
	document.documentElement.style.setProperty('--text', '#FBFBFB');
} else {
	document.documentElement.style.setProperty('--accent-color', '#D2D2D2');
	document.documentElement.style.setProperty('--background', '#EBEBEB');
	document.documentElement.style.setProperty('--hard-background', '#EEEEEE');
	document.documentElement.style.setProperty('--soft-background', '#CCCCCC');
	document.documentElement.style.setProperty('--text', '#1B1B1B');
}

document.documentElement.addEventListener('pointerdown', function(event) {
    this.style.setProperty('--offsetX', event.offsetX);
    this.style.setProperty('--offsetY', event.offsetY);
});