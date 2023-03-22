import Tool from "./Tool.js";

export default class extends Tool {
	get radius() {
		const old = this.mouse.old.toCanvas(this.canvas);
		const position = this.mouse.position.toCanvas(this.canvas);
		return Math.sqrt((position.x - old.x) ** 2 + (position.y - old.y) ** 2);
	}

	_size = 4;
	points = []
	segmentLength = 2;
	draw(ctx) {
		if (!this.active) return;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = (this.scenery || this.mouse.isAlternate) ? this.canvas.sceneryStyle : this.canvas.physicsStyle;
		ctx.moveTo(this.points[0], this.points[1]);
		for (let i = 2; i < this.points.length; i += 2) {
			ctx.lineTo(this.points[i], this.points[i + 1]);
		}

		ctx.stroke();
		ctx.restore();
	}

	press() {
		this.active = true;
	}

	stroke() {
		if (!this.active) return;
		this.points.splice(0);
		const old = this.mouse.old.toCanvas(this.canvas);
		for (let i = 0; i <= 360; i += this.segmentLength / (this.radius / 360)) {
			this.points.push(
				Math.floor(old.x + this.radius * Math.cos(i * Math.PI / 180)),
				Math.floor(old.y + this.radius * Math.sin(i * Math.PI / 180))
			);
		}

		this.points.push(this.points[0], this.points[1]);
	}

	clip() {
		if (!this.active) return;
		this.active = false;
		const old = this.mouse.old.toCanvas(this.canvas);
		const position = this.mouse.position.toCanvas(this.canvas);
		if (old.x === position.x && old.y === position.y) {
			return;
		}

		const clone = structuredClone(this.points);
		this.canvas.layers.selected.physics.push(clone);
		this.canvas.events.push({
			action: 'add',
			value: clone
		});
		this.points.splice(0);
	}

	close() {
		this.active = false;
	}
}