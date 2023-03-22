import Tool from "./Tool.js";

export default class extends Tool {
	cache = [];
	clipboard = [];
	pointA = null;
	pointB = null;
	selected = [];
	draw(ctx) {
		if (!this.active) return;
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = '#87CEEB80';
		ctx.strokeStyle = '#87CEEB';
		ctx.rect(Math.min(this.pointA.x, this.pointB.x), Math.min(this.pointA.y, this.pointB.y), Math.abs(this.pointB.x - this.pointA.x), Math.abs(this.pointB.y - this.pointA.y));
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}

	press() {
		if (this.mouse.isAlternate) return;
		this.active = true;
		this.pointA = this.mouse.position.toCanvas(this.canvas);
		this.pointB = Object.assign({}, this.pointA);
	}

	stroke() {
		this.active && (this.pointB = this.mouse.position.toCanvas(this.canvas));
	}

	clip() {
		if (!this.active) return;
		this.active = false;
		if (this.pointA.x === this.pointB.x && this.pointA.y === this.pointB.y) {
			return;
		}
	}

	close() {
		this.active = false;
	}
}