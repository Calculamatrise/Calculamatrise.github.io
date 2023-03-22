import Tool from "./Tool.js";

export default class extends Tool {
	_size = 4;
	pointA = null;
	pointB = null;
	get x() {return Math.min(this.pointA.x, this.pointB.x)}
	get y() {return Math.min(this.pointA.y, this.pointB.y)}
	get width() {return Math.abs(this.pointB.x - this.pointA.x)}
	get height() {return Math.abs(this.pointB.y - this.pointA.y)}
	draw(ctx) {
		if (!this.mouse.down) return;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.canvas.physicsStyle;
		ctx.rect(Math.min(this.pointA.x, this.pointB.x), Math.min(this.pointA.y, this.pointB.y), Math.abs(this.pointB.x - this.pointA.x), Math.abs(this.pointB.y - this.pointA.y));
		ctx.stroke();
		ctx.restore();
	}

	press(event) {
		this.active = true;
		this.pointA = this.mouse.position.toCanvas(this.canvas);
		this.pointB = Object.assign({}, this.pointA);
	}

	stroke(event) {
		this.active && (this.pointB = this.mouse.position.toCanvas(this.canvas));
	}

	clip(event) {
		if (!this.active) return;
		this.active = false;
		if (this.pointA.x === this.pointB.x && this.pointA.y === this.pointB.y) {
			return;
		}

		const x = Math.min(this.pointA.x, this.pointB.x);
		const y = Math.min(this.pointA.y, this.pointB.y);
		const width = Math.abs(this.pointB.x - this.pointA.x);
		const height = Math.abs(this.pointB.y - this.pointA.y);
		this.canvas.layers.selected.physics.push([
			x, y,
			x, y + height,
			x + width, y + height,
			x + width, y,
			x, y
		]);
		this.canvas.events.push({
			action: 'add',
			value: [
				x, y,
				x, y + height,
				x + width, y + height,
				x + width, y,
				x, y
			]
		});
		this.pointA = null;
		this.pointB = null;
	}

	close() {
		this.active = false;
	}
}