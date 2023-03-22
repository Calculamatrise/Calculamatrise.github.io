import Tool from "./Tool.js";

export default class extends Tool {
	_size = 4;
	points = [];
	draw(ctx) {
		if (!this.active) return;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.canvas.physicsStyle;
		ctx.moveTo(this.points[0], this.points[1]);
		for (let i = 2; i < this.points.length; i += 2) {
			ctx.lineTo(this.points[i], this.points[i + 1]);
		}

		const position = this.mouse.position.toCanvas(this.canvas);
		ctx.lineTo(position.x, position.y);
		ctx.stroke();
		ctx.restore();
	}

	press() {
		this.active = true;
		const position = this.mouse.position.toCanvas(this.canvas);
		this.points.push(position.x, position.y);
	}

	stroke() {
		if (!this.active) return;
		const old = this.mouse.old.toCanvas(this.canvas);
		const position = this.mouse.position.toCanvas(this.canvas);
		if (Math.sqrt((position.x - old.x) ** 2 + (position.y - old.y) ** 2) < this.size) {
			return;
		}

		this.points.push(position.x, position.y);
		this.mouse.old = Object.assign({}, this.mouse.position);
	}

	clip() {
		if (!this.active) return;
		this.active = false;
		const clone = structuredClone(this.points);
		this.canvas.layers.selected.physics.push(clone);
		this.canvas.events.push({
			action: 'add',
			value: clone
		});
		this.points = [];
	}

	close() {
		this.active = false;
	}
}