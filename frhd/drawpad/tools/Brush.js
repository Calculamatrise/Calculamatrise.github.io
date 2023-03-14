import Stroke from "../utils/Stroke.js";
import Tool from "./Tool.js";

export default class extends Tool {
	_size = 4;
	element = new Stroke();
	init() {
		this.element.strokeWidth = this.size;
	}

	press() {
		this.active = true;
		this.element.strokeWidth = this.size;
		this.element.strokeStyle = this.canvas.primary;
		this.element.fillStyle = 'transparent';
		this.element.addPoints(this.mouse.pointA.x, this.mouse.pointA.y);
	}

	stroke() {
		if (this.mouse.pointA.x === this.mouse.position.x && this.mouse.pointA.y === this.mouse.position.y) {
			return;
		}

		this.element.addPoints(this.mouse.position.x, this.mouse.position.y);
	}

	clip(event) {
		if (!this.active) {
			return;
		}

		this.active = false;
		if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
			return;
		}

		const temp = this.element.clone();
		this.element.points = [];
		this.canvas.layer.lines.push(temp);
		this.canvas.events.push({
			action: 'add',
			value: temp
		});
	}

	close() {
		this.active = false;
		this.element.points = [];
	}
}