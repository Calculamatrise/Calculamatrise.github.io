import Tool from "./Tool.js";

export default class extends Tool {
	stroke(event) {
		if (this.mouse.down && !this.mouse.isAlternate) {
			this.canvas.camera.x -= event.movementX * window.devicePixelRatio;
			this.canvas.camera.y -= event.movementY * window.devicePixelRatio;
			this.canvas.ctx.translate(event.movementX * window.devicePixelRatio / this.canvas.zoom, event.movementY * window.devicePixelRatio / this.canvas.zoom);
		}
	}
}