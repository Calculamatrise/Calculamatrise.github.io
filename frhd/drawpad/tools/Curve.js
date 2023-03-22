import Tool from "./Tool.js";

export default class extends Tool {
	_size = 4;
	active = false;
	pointA = null;
	pointB = null;
	points = []
	segmentLength = 2;
	draw(ctx) {
		if (!this.pointA) return;
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
		if (this.active) return;
		this.pointA = this.mouse.position.toCanvas(this.canvas);
		this.pointB = Object.assign({}, this.pointA);
	}

	stroke() {
		const position = this.mouse.position.toCanvas(this.canvas);
		if (this.active) {
			this.points.splice(0);
			// calculate length to determine devision of segment length
			const old = this.mouse.old.toCanvas(this.canvas);
			const position = this.mouse.position.toCanvas(this.canvas);
			const len = Math.sqrt((position.x - old.x) ** 2 + (position.y - old.y) ** 2);
			for (let i = 0; i <= 1; i += this.segmentLength / (len / 2)) {
				this.points.push(
					Math.floor(Math.pow((1 - i), 2) * this.pointA.x + 2 * (1 - i) * i * position.x + Math.pow(i, 2) * this.pointB.x),
					Math.floor(Math.pow((1 - i), 2) * this.pointA.y + 2 * (1 - i) * i * position.y + Math.pow(i, 2) * this.pointB.y)
				);
			}

			this.pointB && this.points.push(this.pointB.x, this.pointB.y);
		} else if (this.mouse.down && !this.mouse.isAlternate) {
			this.points.splice(0);
			this.pointA && this.points.push(this.pointA.x, this.pointA.y, position.x, position.y);
		}
	}

	clip() {
		if (this.active) {
			this.active = false;
			this.pointA = null;
			const clone = structuredClone(this.points);
			this.canvas.layers.selected.physics.push(clone);
			this.canvas.events.push({
				action: 'add',
				value: clone
			});
			this.points.splice(0);
			return;
		}

		this.pointB = this.mouse.position.toCanvas(this.canvas);
		this.points.splice(0);
		this.points.push([this.pointA.x, this.pointA.y], [this.pointB.x, this.pointB.y]);
		this.active = true;
	}
}