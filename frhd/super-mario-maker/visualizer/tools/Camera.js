import Tool from "./Tool.js";

export default class extends Tool {
	stroke(event) {
		if (this.mouse.down && !this.mouse.isAlternate) {
			this.canvas.camera.x -= event.movementX;
			this.canvas.camera.y -= event.movementY;
		}
	}
}