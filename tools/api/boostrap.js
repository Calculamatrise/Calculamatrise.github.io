import Game from "./Game.js";

window.Game = new Game(canvas);

canvas.onresize = function() {
    this.setAttribute('height', +getComputedStyle(this).getPropertyValue('height').slice(0, -2) * window.devicePixelRatio);
  	this.setAttribute('width', +getComputedStyle(this).getPropertyValue('width').slice(0, -2) * window.devicePixelRatio);
}
window.onresize = () => canvas.onresize();
canvas.onresize();